import { motion } from "framer-motion"
import Image from "next/image"


export const Loader = () => {
    return (
        <div className="relative w-full h-[120px] overflow-hidden">
            <motion.div
                initial={{ left: 0 }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
                className="absolute bottom-0"
            >
                <Image src="/loader.png" alt="loader" width={96} height={96} />
            </motion.div>
        </div>
    );
};