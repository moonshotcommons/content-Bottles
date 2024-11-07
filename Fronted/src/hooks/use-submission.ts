import { useState } from "react";
import toast from "react-hot-toast";
import { checkTextWithAI } from "@/utils";
import { handleUpload } from "@/utils/storage";
import useInteracton from "./use-interacton";
export function useSubmission() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isPending, setIsPening] = useState(false);

  const { handleCreateBottle, handleReplyBottle } = useInteracton();
  const handleSubmit = async (objectId?: string) => {
    setIsPening(true);
    const toStore: (string | File)[] = [];

    if (content) {
      try {
        setIsChecking(true);
        const checkResult = await checkTextWithAI(content);

        if (!checkResult.isAcceptable) {
          setAiSuggestion(checkResult.suggestions);
          toast.error(
            "Text content is inappropriate. Please review the suggestions and modify.",
          );

          return;
        }
      } catch (error) {
        console.error("AI check failed:", error);
      } finally {
        setIsChecking(false);
      }
      toStore.push(content);
    }

    if (image) {

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const validAudioTypes = [
        "audio/mpeg", // MP3
        "audio/wav",  // WAV
        "audio/ogg",  // OGG
        "audio/flac", // FLAC
      ];
      const validVideoTypes = [
        "video/mp4",    // MP4
        "video/webm",   // WebM
        "video/ogg",    // OGG
        "video/x-matroska", // MKV
      ];

      // 检查文件类型
      if (
        !validImageTypes.includes(image.type) &&
        !validAudioTypes.includes(image.type) &&
        !validVideoTypes.includes(image.type)
      ) {
        toast.error("Please upload a valid image, audio, or video file");
        return;
      }


      if (image.size > 50 * 1024 * 1024) {
        toast.error("File size cannot exceed 50MB");

        return;
      }
      toStore.push(image);
    }

    if (toStore.length === 0) {
      toast.error("Please enter text or upload an image");

      return;
    }

    const ipfsResults = await handleUpload(toStore);

    if (objectId) {
      await handleReplyBottle(objectId, ipfsResults);
    } else {
      await handleCreateBottle(ipfsResults);
    }
    setIsPening(false);
  };

  return {
    content,
    setContent,
    image,
    setImage,
    isPending,
    aiSuggestion,
    isChecking,
    handleSubmit,
  };
}
