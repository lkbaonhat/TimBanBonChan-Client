import { LOGO } from "@/constants/global";

export default function LoadingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#ffedfa]">
            <div className="flex flex-col items-center space-y-8">
                {/* Logo with rotation animation */}
                <div className="relative">
                    <img src={LOGO.NO_TEXT} alt='logo' className="h-72 w-auto animate-spin" style={{ animationDuration: "3s" }} />
                </div>
            </div>
        </div>
    )
}
