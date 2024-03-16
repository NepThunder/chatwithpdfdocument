import ChatWrapper from '@/app/components/chat/ChatWrapper'
import PdfRenderer from '@/app/components/PdfRenderer'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'

interface PageProps {
  params: {
    fileId: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { fileId } = params

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id)
    redirect(`/auth-callback?origin=dashboard/${fileId}`)

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  })

  if (!file) notFound()


  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* Left sidebar & main wrapper */}
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            {/* Main area */}
            <PdfRenderer url={file.url} />
          </div>
        </div>
        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  )
}

export default Page


  
