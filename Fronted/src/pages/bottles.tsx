import { useEffect, useState } from "react";
import { Skeleton, Button, useDisclosure } from "@nextui-org/react";
import { W3mConnectButton } from "@reown/appkit";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import DefaultLayout from "@/layouts/default";
import { getBottleImage } from "@/utils/storage";
import { Bottle } from "@/types";
import BottleModal from "@/components/BottleModal";
import MintForm from "@/components/mint-form";
import { useBottles } from "@/hooks/useBottles";
import { useAccount } from "wagmi";

function getFromId(bottle: Bottle) {
  const fromId = bottle.from;
  return `${fromId.slice(0, 4)}...${fromId.slice(-4)}`;
}

export default function BottlesPage() {
  const account = useAccount();

  const [activeTab, setActiveTab] = useState("unread");
  const [filteredBottles, setFilteredBottles] = useState<Bottle[]>([]);

  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { bottles, sentBottles, repliedBottles, refresh, isLoading } = useBottles();

  useEffect(() => {
    // 根据activeTab过滤瓶子
    if (activeTab === "unread") {
      setFilteredBottles(
        bottles.filter((bottle) => bottle.isOpen === false)
      );
    } else if (activeTab === "bottles") {
      setFilteredBottles(
        bottles.filter((bottle) => bottle.from === account?.address),
      );
    } else if (activeTab === "friends") {
      setFilteredBottles(
        bottles.filter((bottle) => bottle.to === account?.address),
      );
    }
  }, [activeTab, bottles, account]);

  useEffect(() => {
    if (!isOpen) {
      refresh();
    }
  }, [isOpen]);

  const handleOpenBottle = (bottle: Bottle) => {
    if (!account?.address) {
      toast.error("Please connect your wallet");
      return;
    }
    setSelectedBottle(bottle);
    onOpen();
  };

  return (
    <DefaultLayout>
      <div className="flex h-full w-full">
        {/* 左侧导航栏 */}
        <div className="w-80 min-w-80 p-6 bg-gray-900 text-white">
          <img
            alt="Wallet Avatar"
            className="w-32 h-32 mx-auto rounded-full border-4 border-white mb-6"
            src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${account?.address || "default"}`}
          />
          <div className="mb-6 text-center">
            <p className="text-sm">Bottles: {sentBottles}</p>
            <p className="text-sm">Repied: {repliedBottles}</p>
          </div>
          <div className="flex flex-col space-y-3">
            {[
              { key: "unread", label: "New Bottles" },
              { key: "drop", label: "Drop a Bottle" },
              { key: "bottles", label: "My Bottles" },
              { key: "friends", label: "Friends" },
            ].map((item) => (
              <button
                key={item.key}
                className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 ${
                  activeTab === item.key
                    ? "bg-white text-gray-900 font-semibold"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div
          className="flex-grow p-4 bg-cover bg-center bg-no-repeat overflow-y-auto"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/bottles-bg.webp')",
          }}
        >
          {(activeTab === "bottles" || activeTab === "friends") &&
            !account?.address && (
              <div className="flex justify-center items-center h-full">
                <w3m-connect-button />
              </div>
            )}
          {(activeTab === "unread" || account?.address) &&
            activeTab !== "drop" && (
              <div className="show-all-bottles flex flex-wrap gap-4">
                {isLoading &&
                  Array(8)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="w-64 h-80 bg-white rounded-lg p-4"
                      >
                        <Skeleton className="rounded-lg">
                          <div className="h-32 rounded-lg bg-default-300" />
                        </Skeleton>
                        <div className="space-y-3 mt-4">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                          </Skeleton>
                        </div>
                      </div>
                    ))}
                {filteredBottles.length > 0 &&
                  // Show actual bottle data
                  filteredBottles.map((bottle) => (
                    <motion.div
                      key={bottle.id}
                      layout
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 border rounded-lg shadow-lg w-64 h-80 overflow-hidden bg-white text-black flex flex-col 
                        justify-between cursor-pointer"
                      exit={{ opacity: 0, scale: 0.8 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenBottle(bottle)}
                    >
                      <div className="flex-grow flex items-center justify-center">
                        <img
                          alt="Bottle"
                          className="h-36 w-auto object-contain"
                          src={getBottleImage(bottle, activeTab === "unread")}
                        />
                      </div>
                      <div className="space-y-2">
                        {activeTab !== "unread" &&
                          bottle.displayMsg.length > 0 && (
                            <p className="text-sm text-center font-medium truncate">
                              {bottle.displayMsg}
                            </p>
                          )}

                        <p className="text-xs text-center text-gray-600">
                          From: {getFromId(bottle)}
                        </p>
                      </div>
                      <Button
                        className="bg-[#fb0c0c] text-white hover:bg-[#d80a0a] w-auto mx-auto mt-3 rounded-full 
                        transition-all duration-300 hover:shadow-xl hover:scale-105
                        "
                        size="sm"
                        onClick={() => handleOpenBottle(bottle)}
                      >
                        {activeTab === "unread" ? "Open Bottle" : "View"}
                      </Button>
                    </motion.div>
                  ))}
                {filteredBottles.length === 0 && !isLoading && (
                  <div className="flex justify-center items-center h-full bg-white px-8 py-4 mx-auto rounded-lg">
                    <p className="text-gray-500">No bottles found</p>
                  </div>
                )}
              </div>
            )}
          {activeTab === "drop" && (
            <div className="flex justify-center items-center h-full">
              <MintForm onSubmit={refresh} />
            </div>
          )}
        </div>
      </div>

      {selectedBottle && (
        <BottleModal
          isOpen={isOpen}
          selectedBottle={selectedBottle}
          onOpenChange={onOpenChange}
        />
      )}
    </DefaultLayout>
  );
}
