import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { Bottle } from "@/types";
import { getBlobWithCache, getBlob } from "@/utils/storage";
import { useAccount } from "wagmi";

import useInteracton from "@/hooks/use-interacton"


async function toBottle(obj: any): Promise<Bottle> {
  const msgIds = obj.msgs.map((msg: any) => msg.ipfsHash);
  const promises = msgIds.map((id: string) => getBlob(id));
  const blobs = await Promise.all(promises);
  const displayMsg =
    blobs.find((blob) => blob.mediaType === "text")?.content || "";
  const timestamp = parseInt(obj.fromTime) * 1000;
  const createAt = dayjs(timestamp).format("MMM D, YYYY h:mm A");

  return {
    id: Number(obj.id).toString(),
    from: obj.from,
    to: obj.to,
    displayMsg: displayMsg,
    createAt: createAt,
    msgs: blobs.map((blob: any) => ({
      content: blob.content,
      mediaType: blob.mediaType,
    })),
    isOpen: obj.isOpen,
  };
}

export function useBottles() {
  const account = useAccount();
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [sentBottles, setSentBottles] = useState(0);
  const [repliedBottles, setRepliedBottles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { allBottles } = useInteracton();
  const fetchBottles = async () => {
    setIsLoading(true);
    if (allBottles) { // 添加检查以确保 allBottles 不为 undefined
      const fetchedBottles = await Promise.all(allBottles.map((obj) => toBottle(obj)));
      setBottles(fetchedBottles || []);
      const sentCount = fetchedBottles.filter(
        (obj: any) =>
          obj.from == account.address,
      ).length;
      const repliedCount = fetchedBottles.filter(
        (obj: any) =>
          obj.to == account.address,
      ).length;

      setSentBottles(sentCount);
      setRepliedBottles(repliedCount);

    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (allBottles) fetchBottles();
  }, [allBottles]);

  const refresh = () => {
    setTimeout(() => {
      fetchBottles();
    }, 1000);
  };

  return { bottles, sentBottles, repliedBottles, refresh, isLoading };
}
