'use client'
 
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { LucideCheck, LucideClipboard, LucideClipboardCheck, LucideShare } from 'lucide-react';
 
export default function ProfileShareButton({self, _username}: {self: boolean, _username: string | null}) {
  const [intent, setIntent] = useState('');
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    const profileLink = `${window.location.origin}${pathname}`
    if (self) {
      setIntent(`https://twitter.com/intent/post?text=do%20you%20think%20my%20pfp%20is%20cool%3F%20then%20go%20vote%20for%20me%20on%20coolestpfpofalltime%20now!%0A&url=${profileLink}`)
    } else {
      const username = _username ? `%20${encodeURIComponent(_username)}` : '';
      setIntent(`https://twitter.com/intent/post?text=i%20think%20my%20homie${username}%20has%20the%20best%20pfp%20on%20tpot%2C%20you%20think%20so%20too%3F%0A%0Ago%20vote%20for${username || '%20them'}%20on%20coolestpfpofalltime%20now!%0A&url=${profileLink}`)
    }
  }, [pathname, searchParams])

  const [copiedState, setCopiedState] = useState(false);
  const copyWindowURL = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedState(true);
  }

  useEffect(() => {
    // if copiedState is true, set it back to false after 3 seconds
    if (copiedState) {
      const timeout = setTimeout(() => {
        setCopiedState(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copiedState])

  if (self) {
    return (
      <div className='flex items-center justify-center gap-2'>
        {/* copy link to clipboard button */}
        <Button className="rounded-xl mt-4 font-mono" size={"icon"} onClick={copyWindowURL}>
          {copiedState ? <LucideCheck size={14} /> : <LucideClipboard size={14} />}
        </Button>
        <Button disabled={!intent} className="rounded-xl mt-4 font-mono" asChild>
          <a href={intent} target='_blank' className='flex gap-2 items-center justify-center'>
            <LucideShare size={14} />
            Share Your Profile on X
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className='group'>
      <Button disabled={!intent} className="absolute top-5 right-3 rounded-xl mt-4 font-mono z-50" asChild size={'icon'}>
        <a href={intent} target='_blank'>
          <LucideShare size={16} />
        </a>
      </Button>
      <Button className="absolute top-5 right-3 rounded-xl mt-4 font-mono group-hover:top-16 transition-all duration-300 ease-in-out" size={"icon"} onClick={copyWindowURL}>
        {copiedState ? <LucideCheck size={14} /> : <LucideClipboard size={14} />}
      </Button>
    </div>
  )
}