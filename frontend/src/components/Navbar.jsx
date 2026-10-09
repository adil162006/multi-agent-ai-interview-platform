import { useNavigate } from 'react-router-dom'

const Navbar = ({ label, action }) => {
  const navigate = useNavigate()

  return (
    <nav className='fixed inset-x-0 top-0 border-b border-black/8 bg-white/8 backdrop-blur-xl'>
      <div className='mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5'>
        <button
          type='button'
          onClick={() => navigate('/dashboard')}
          className='flex cursor-pointer items-center gap-1.5'
        >
          <span className='text-sm font-extrabold text-black sm:text-base'>HireMind</span>
          <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>
            {label}
          </span>
        </button>
        {action}
      </div>
    </nav>
  )
}

export default Navbar
