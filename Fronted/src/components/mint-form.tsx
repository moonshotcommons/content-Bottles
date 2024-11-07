import { useState } from "react";


import Button from "@/components/Button";
import Input from "@/components/Input";
import { useSubmission } from "@/hooks/use-submission";
import TipCarousel from "@/components/tip-carousel";
import { useAccount } from "wagmi";

export default function MintForm({ onSubmit }: { onSubmit?: () => void }) {
  const { isConnected } = useAccount();
  const account = useAccount();
  const [open, setOpen] = useState(false);

  const {
    content: mintText,
    setContent: setMintText,
    setImage: setMintImage,
    aiSuggestion,
    isChecking,
    isPending,
    handleSubmit: handleMint,
  } = useSubmission();

  const handleFormSubmit = () => {
    handleMint();
    onSubmit?.();
  };

  return (
    <div
      className="mint-form w-full max-w-2xl aspect-[25/19] bg-contain bg-no-repeat bg-center rounded-lg overflow-hidden relative"
      style={{
        backgroundImage: `url(/images/form-bg.png)`,
      }}
    >
      <div className="form-container h-full p-[8%] bg-transparent">
        <div
          className="title w-full bg-contain bg-no-repeat bg-center flex items-center justify-center py-4"
          style={{
            backgroundImage: `url(/images/title-bg.svg)`,
          }}
        >
          <h1 className="text-white text-center text-2xl font-bold">
            Send Drift Bottle
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="mint-amount">Message</label>
            <Input
              id="mint-amount"
              value={mintText}
              onChange={(e) => setMintText(e.target.value)}
            />
          </div>
          {aiSuggestion && (
            <p className="text-red-500 text-sm mt-1">{aiSuggestion}</p>
          )}
          <div className="flex flex-col">
            <label htmlFor="mint-amount">Upload Image</label>
            <Input
              accept="image/*,audio/*,video/*"
              id="mint-amount"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setMintImage(file);
                }
              }}
            />
          </div>
        </div>

        <div className="show-button mt-4">
          {!account ? (
            <>ConnectModal</>
            // <ConnectModal
            //   open={open}
            //   trigger={
            //     <Button isDisabled={!!account}>
            //       {account ? "Connected" : "Connect"}
            //     </Button>
            //   }
            //   onOpenChange={(isOpen) => setOpen(isOpen)}
            // />
          ) : (
            <Button
              isLoading={isPending || isChecking}
              onClick={handleFormSubmit}
            >
              {isPending ? "Sending..." : "Send"}
            </Button>
          )}
        </div>
        <div className="mt-4 ">
          <TipCarousel />
        </div>
      </div>
    </div>
  );
}
