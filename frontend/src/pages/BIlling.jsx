import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FileText, Map, Menu, MessageSquareText, ScanSearch } from 'lucide-react'
import Navbar from '../components/Navbar'
import PlanCard from '../components/billing/PlanCard'
import api from '../utils/axios'
const plans = [
  {
    name: 'Free',
    price: 'Free',
    coinAmount: 150,
    features: ['150 Interview Coins', 'Resume Builder', 'Resume Scorer', 'Roadmap Generator'],
    actionLabel: 'Claimed Coins',
    claimed: true,
  },
  {
    name: 'Starter',
    price: '199',
    coinAmount: 300,
    features: ['300 Interview Coins', 'Unlimited Resume Score', 'Unlimited Roadmaps', 'Priority AI Response'],
    actionLabel: 'Buy Now',
    popular: true,
  },
]

const services = [
  { name: 'Resume Builder', description: 'Create an ATS friendly resume with AI assistance.', cost: 10, icon: FileText },
  { name: 'Resume Scorer', description: 'Analyze your resume and get an improvement score.', cost: 10, icon: ScanSearch },
  { name: 'AI Interview', description: 'Complete a personalized mock interview and get feedback.', cost: 50, icon: MessageSquareText },
  { name: 'Roadmap Generator', description: 'Generate a personalized learning roadmap for your goal.', cost: 20, icon: Map },
]

function Billing({ setUser }) {
  const navigate = useNavigate()
  const [paymentPending, setPaymentPending] = useState(false)

  const handlePayment = async (plan) => {
    if (plan.claimed || paymentPending) return
    setPaymentPending(true)
    try {
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = resolve
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      const { data } = await api.post('/api/billing/create', { planId: plan.name.toLowerCase() })
      const order = data.order
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Hiremind',
        description: `${plan.name} - ${plan.coinAmount} coins`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data: verification } = await api.post('/api/billing/verify', response)
            const { data: credit } = await api.post('/api/auth/add-coins', {
              coins: verification.interviewCoins,
            })
            setUser((current) => ({ ...current, interviewCoin: credit.interviewCoin }))
            toast.success('Payment successful. Coins added to your account.')
            navigate('/dashboard')
          } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification or coin credit failed. Please try again or contact support if you were charged.')
          } finally {
            setPaymentPending(false)
          }
        },
        modal: { ondismiss: () => setPaymentPending(false) },
        theme: { color: '#000000' },
      }
      const checkout = new window.Razorpay(options)
      checkout.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed. Please try again.')
        setPaymentPending(false)
      })
      checkout.open()
    } catch (error) {
      setPaymentPending(false)
      toast.error(error.response?.data?.message || 'Unable to start checkout. Please try again.')
    }
  }
  return (
    <div className="min-h-screen bg-white text-[#111113]">
      <Navbar
        label="Interview Coins"
        action={
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-black/60 transition hover:bg-black/5"
          >
            <Menu size={18} />
          </button>
        }
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-16 pt-24 sm:px-8 sm:pt-28">
        <header className="mb-8 text-center sm:mb-9">
          <h1 className="text-3xl font-bold tracking-tight text-[#111113] sm:text-[36px]">Interview Coins</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/45 sm:text-base">
            Use coins for Resume Scoring, Resume Builder, AI Interviews, and Roadmap Generation.
          </p>
        </header>
        <section aria-label="Coin plans" className="grid w-full max-w-[760px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {plans.map((plan) => <PlanCard key={plan.name} {...plan} disabled={paymentPending} onAction={() => handlePayment(plan)} />)}
        </section>
        <section aria-labelledby="service-costs-heading" className="mt-14 w-full max-w-[760px]">
          <div className="mb-5 text-center">
            <h2 id="service-costs-heading" className="text-xl font-bold tracking-tight sm:text-2xl">Services &amp; coin costs</h2>
            <p className="mt-1.5 text-sm text-black/45">Coins are used when you use a service.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm">
            {services.map(({ name, description, cost, icon: Icon }, index) => (
              <div key={name} className={`flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5 ${index ? 'border-t border-black/[0.06]' : ''}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#161619]">{name}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-black/45 sm:text-sm">{description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-black/[0.045] px-3 py-1.5 text-xs font-semibold text-black/70 sm:text-sm">{cost} coins</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Billing
