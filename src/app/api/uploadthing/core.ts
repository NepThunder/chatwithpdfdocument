import { pinecone } from "@/app/lib/pinecone";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);

    return { message: err.message };
  },
});

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async () => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) throw new Error("UNAUTHORIZED");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const isFileExist = await db.file.findFirst({
        where: {
          key: file.key,
        },
      });
    
      // If file already exists, stop running (prevents duplicates)
      if (isFileExist) return;
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          // url:`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      })
      try{
        const response=await fetch(file.url);
        const blob = await response.blob();
        const loader=new PDFLoader(blob);
        const pageLevelDocs=await loader.load();
        
        //verctorize and index entire document
        const pineconeIndex=pinecone.Index(process.env.PINECONE_INDEX!)

        const embeddings= new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        })

        await PineconeStore.fromDocuments(pageLevelDocs,embeddings,{
          pineconeIndex,
          namespace:createdFile.id,
        })

        await db.file.update({
          data:{
            uploadStatus:"SUCCESS",
          },
          where:{
            id:createdFile.id,
          }
        })

      }catch(error){
        console.dir(error, { depth: null });
        console.log(`Error Type: ${typeof error}\n Error:${error}`);
        await db.file.update({
          data:{
            uploadStatus:"FAILED",
          },
          where:{
            id:createdFile.id,
          }
        })
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
