import React, { useCallback, useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { SquareTerminal, X } from 'lucide-react'

const LANG_OPTIONS = [
  { value: 'javascript', label: 'Javascript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'Cpp' },
]

const DEFAULT_CODE = {
  javascript: `// Write your solution here
function solution() {
  // your code
}`,
  python: `# Write your solution here
def solution():
    pass`,
  java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // your code
    }
}`,
  cpp: `// Write your solution here
#include <iostream>
using namespace std;

int main() {
    // your code
    return 0;
}`,
}

function CodeEditor({ onClose, onSubmitCode }) {
  const [lang, setLang] = useState('javascript')
  const [code, setCode] = useState(DEFAULT_CODE['javascript'])

  // Remembers what was typed in each language so switching tabs doesn't lose work
  const drafts = useRef({})

  const handleLangChange = (nextLang) => {
    if (nextLang === lang) return
    drafts.current[lang] = code
    setLang(nextLang)
    setCode(drafts.current[nextLang] ?? DEFAULT_CODE[nextLang])
  }

  const handleClose = useCallback(() => {
    onSubmitCode?.(code, lang)
    onClose?.()
  }, [code, lang, onClose, onSubmitCode])

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e] text-white shadow-2xl">
        {/* Header */}
        <header className="relative flex items-center justify-between border-b border-white/10 bg-[#101115] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SquareTerminal size={16} className="text-white/60" />
            Code Editor
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 sm:flex">
            {LANG_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLangChange(option.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  lang === option.value
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Close code editor"
            onClick={handleClose}
            className="rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </header>

        {/* Language tabs on small screens */}
        <div className="flex items-center justify-center gap-1 border-b border-white/10 bg-[#101115] px-4 py-2 sm:hidden">
          {LANG_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleLangChange(option.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                lang === option.value ? 'bg-white text-black' : 'text-white/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="relative min-h-0 flex-1">
          <Editor
            height="100%"
            language={lang}
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 12 },
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontLigatures: true,
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
              automaticLayout: true,
            }}
          />
        </div>

        {/* Footer */}
        <footer className="flex justify-end border-t border-white/10 bg-[#101115] px-4 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
          >
            Add To Answer
          </button>
        </footer>
      </div>
    </div>
  )
}

export default CodeEditor
