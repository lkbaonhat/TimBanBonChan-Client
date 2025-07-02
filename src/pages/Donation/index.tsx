import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { BANNER, LOGO } from "@/constants/global"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"
import ROUTES from "@/constants/routes"

const donationSchema = z.object({
    currency: z.string().min(1, "Vui lòng chọn đơn vị tiền tệ"),
    frequency: z.string().min(1, "Vui lòng chọn hình thức donate"),
    amount: z.string().min(1, "Vui lòng chọn số tiền"),
    customAmount: z.string().optional(),
    fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
    agreeTerms: z.boolean().refine((val) => val === true, "Bạn phải đồng ý với điều khoản"),
    cardNumber: z.string().min(16, "Số thẻ không hợp lệ"),
    expiryDate: z.string().min(5, "Ngày hết hạn không hợp lệ"),
    securityCode: z.string().min(3, "Mã bảo vệ không hợp lệ"),
})

const contactSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
})

export default function DonationPage() {
    const donationForm = useForm<z.infer<typeof donationSchema>>({
        resolver: zodResolver(donationSchema),
        defaultValues: {
            currency: "",
            frequency: "",
            amount: "",
            customAmount: "",
            fullName: "",
            email: "",
            address: "",
            agreeTerms: false,
            cardNumber: "",
            expiryDate: "",
            securityCode: "",
        },
    })

    const contactForm = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            email: "",
            phone: "",
        },
    })

    const presetAmounts = ["20,000", "50,000", "1,000,000", "200,000", "500,000"]

    function onDonationSubmit(values: z.infer<typeof donationSchema>) {
        console.log("Donation form:", values)
    }

    function onContactSubmit(values: z.infer<typeof contactSchema>) {
        console.log("Contact form:", values)
    }

    return (
        <div className="min-h-screen my-10">
            {/* Breadcrumb */}
            <Breadcrumb className="container mx-auto px-4 pb-10">
                <BreadcrumbList className="flex items-center gap-2 text-sm text-gray-600">
                    <BreadcrumbItem>
                        <Link to={ROUTES.PUBLIC.HOME}>
                            Trang chủ
                        </Link>
                    </BreadcrumbItem>
                    <ChevronRight className="h-4 w-4" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold">
                            Quyên góp
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="container mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-2 gap-36 pb-10">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Main Content */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-6">Mỗi sự đóng góp là một hy vọng</h1>

                            <div className="mb-6">
                                <img
                                    src={BANNER.DOG_CIRCLE}
                                    alt="Dogs looking down in a circle"
                                    className="rounded-2xl w-full"
                                />
                            </div>

                            <div className=" text-gray-700">
                                <p className="font-semibold text-blue-600">Hãy cùng lan tỏa yêu thương!</p>
                                <p className="text-sm leading-relaxed">
                                    Mỗi sự đóng góp của bạn đều mang lại ý nghĩa to lớn, giúu mang đến hy vọng và sự sống cho những bé thú
                                    cưng bé bỏng rơi vào cảnh khó khăn và được chăm sóc cẩn thận và tận tâm mỗi đêm mỗi ngày cho đến khi
                                    chúng có thể tìm thấy đôi chủ cuộc đời của mình.
                                </p>
                                <p className="text-sm">
                                    💝 <span className="text-orange-500 font-semibold">QUYÊN GÓP</span> ngay để cứu những chú chó với niềm
                                    nồng cầu chuyện hạnh phúc!
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="flex justify-center mb-4">
                                        <img src={LOGO.MESSAGE_PINK} alt="message-icon" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Bạn có câu hỏi về phần Quyên góp</h3>
                                </div>

                                <Form {...contactForm}>
                                    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                                        <FormField
                                            control={contactForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Địa chỉ email của bạn</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ví dụ: nguyenvan@gmail.com" {...field} className="bg-white" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={contactForm.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Câu hỏi của bạn</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nhập câu hỏi của bạn" {...field} className="bg-white" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button variant={"blue"} type="submit" className="w-full">
                                            Gửi câu hỏi
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Donation Form */}
                    <div>
                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardContent className="py-10 px-20">
                                <Form {...donationForm}>
                                    <form onSubmit={donationForm.handleSubmit(onDonationSubmit)} className="space-y-14">
                                        <div className="space-y-6">
                                            {/* Currency Selection */}
                                            <FormField
                                                control={donationForm.control}
                                                name="currency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mb-2">Chọn đơn vị tiền tệ của bạn</FormLabel>
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger className="bg-white w-full">
                                                                    <SelectValue placeholder="VND" />
                                                                </SelectTrigger>
                                                                <SelectContent className="w-full">
                                                                    <SelectItem value="VND">VND</SelectItem>
                                                                    <SelectItem value="USD">USD</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Donation Frequency */}
                                            <FormField
                                                control={donationForm.control}
                                                name="frequency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mb-2">Hình thức donate</FormLabel>
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger className="bg-white w-full">
                                                                    <SelectValue placeholder="Hàng tháng" />
                                                                </SelectTrigger>
                                                                <SelectContent className="w-full">
                                                                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                                                                    <SelectItem value="once">Một lần</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Preset Amounts */}
                                            <FormField
                                                control={donationForm.control}
                                                name="amount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {presetAmounts.map((amount) => (
                                                                <Button
                                                                    key={amount}
                                                                    type="button"
                                                                    variant={field.value === amount ? "default" : "outline"}
                                                                    className={`h-12 ${field.value === amount ? "bg-blue-600 hover:bg-blue-700" : "bg-white hover:bg-gray-50"
                                                                        }`}
                                                                    onClick={() => field.onChange(amount)}
                                                                >
                                                                    {amount}
                                                                </Button>
                                                            ))}
                                                            <Button
                                                                type="button"
                                                                variant={field.value === "custom" ? "default" : "outline"}
                                                                className={`h-12 ${field.value === "custom" ? "bg-blue-600 hover:bg-blue-700" : "bg-white hover:bg-gray-50"
                                                                    }`}
                                                                onClick={() => field.onChange("custom")}
                                                            >
                                                                Nhập số tiền khác
                                                            </Button>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Personal Information */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">Thông tin của bạn</h3>

                                            <FormField
                                                control={donationForm.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mb-2">Họ và tên</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-white" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={donationForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mb-2">Email</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" {...field} className="bg-white" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={donationForm.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mb-2">Địa chỉ</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-white" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={donationForm.control}
                                                name="agreeTerms"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <Label className="text-sm">Tôi đồng ý với các điều khoản</Label>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Payment Method */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">Thanh toán</h3>

                                            <div className="flex gap-2">
                                                <img src={LOGO.PAYMENT_METHOD} alt="payment-logo" />
                                            </div>

                                            <FormField
                                                control={donationForm.control}
                                                name="cardNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mb-2">Số thẻ</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="1234 5678 9012 3456" {...field} className="bg-white" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={donationForm.control}
                                                    name="expiryDate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="mb-2">Ngày hết hạn</FormLabel>
                                                            <FormControl>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            const currentValue = field.value || ""
                                                                            const [, year] = currentValue.split("/")
                                                                            field.onChange(`${value}/${year || ""}`)
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="bg-white">
                                                                            <SelectValue placeholder="Tháng" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Array.from({ length: 12 }, (_, i) => (
                                                                                <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                                                                    {String(i + 1).padStart(2, "0")}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            const currentValue = field.value || ""
                                                                            const [month] = currentValue.split("/")
                                                                            field.onChange(`${month || ""}/${value}`)
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="bg-white">
                                                                            <SelectValue placeholder="Năm" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Array.from({ length: 10 }, (_, i) => {
                                                                                const year = new Date().getFullYear() + i
                                                                                return (
                                                                                    <SelectItem key={year} value={String(year)}>
                                                                                        {year}
                                                                                    </SelectItem>
                                                                                )
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={donationForm.control}
                                                    name="securityCode"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="mb-2">Mã bảo vệ</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="123" {...field} className="bg-white" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            variant={"pink"}
                                            className="w-full text-white font-semibold py-3 rounded-full"
                                        >
                                            QUYÊN GÓP
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
