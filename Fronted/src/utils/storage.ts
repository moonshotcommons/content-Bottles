 import { cacheWithSessionStorageDecorator } from "./index";

import BottleImageType1 from "/images/bottles/1.png";
import BottleImageType2 from "/images/bottles/2.png";
import BottleImageType3 from "/images/bottles/3.png";

import { Bottle } from "@/types";

// Todo
export async function handleUpload (toStore: any[]){
 //Todo
};

export async function handleGetData (cid: string){
  //Todo
};

export function getBottleImage(bottle: Bottle, isUnread = false) {
  const bottleImg = bottle.msgs.find((msg) => msg.mediaType === "image");

  if (!isUnread && bottleImg) {
    return bottleImg.content;
  }
  const idNum = parseInt(bottle.id) % 3;

  switch (idNum) {
    case 0:
      return BottleImageType1;
    case 1:
      return BottleImageType2;
    case 2:
      return BottleImageType3;
  }
}

export async function getBlob(id: string) {
  const response = await handleGetData(id);
  if (response) {
    const contentType = response.contentType;

    if (contentType && contentType.startsWith("image/")) {
      return {
        content: `${siteConfig.pinata.pinataGateway}/ipfs/${id}`,
        mediaType: "image",
      };
    } else if (contentType && contentType.startsWith("audio/")) {
      return {
        content: `${siteConfig.pinata.pinataGateway}/ipfs/${id}`,
        mediaType: "audio",
      };
    } else if (contentType && contentType.startsWith("video/")) {
      return {
        content: `${siteConfig.pinata.pinataGateway}/ipfs/${id}`,
        mediaType: "video",
      };
    } else if (contentType && contentType === "application/json") {
      return {
        content: response.data?.content,
        mediaType: "text",
      };
    }
    return null;
  }
}

export const getBlobWithCache = cacheWithSessionStorageDecorator(getBlob);
