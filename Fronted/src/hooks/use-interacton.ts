
import toast from "react-hot-toast";
// Todo

export default function useInteracton() {
    const { writeContract } = useWriteContract();

    // allBottles
    // handleCreateBottle
    // handleReplyBottle

    return {
        handleCreateBottle,
        handleReplyBottle,
        allBottles
    }
}