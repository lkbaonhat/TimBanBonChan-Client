import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Card from "@/components/Card/Card";
import { Separator } from "@/components/ui/separator";

export default function PetCareHistory() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cat 1 */}
          <Card
            type="pet"
            image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iqVxjNK7x1DWOMawOSw9OBgewjcpBG.png"
            title="Hoàng tử Cát"
            badge="Mèo"
            gender="Đực"
            location="1 tuổi"
            className="h-full"
          />

          {/* Cat 2 */}
          <Card
            type="pet"
            image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iqVxjNK7x1DWOMawOSw9OBgewjcpBG.png"
            title="Liu"
            badge="Mèo"
            gender="Đực"
            location="1 tuổi"
            className="h-full"
          />

          {/* Cat 3 */}
          <Card
            type="pet"
            image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iqVxjNK7x1DWOMawOSw9OBgewjcpBG.png"
            title="Điều"
            badge="Mèo"
            gender="Đực"
            location="1 tuổi"
            className="h-full"
          />
        </div>
      </div>

      {/* <div className="rounded-xl">
        <ContentHeader title="Kỹ năng nuôi thú cưng" level="h2" />

        <div className="space-y-4 mt-6">
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="rounded-xl">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-2">
                    Chăm sóc lông mao
                  </h3>
                  <p className="text-sm text-gray-600">Tắm rửa, gỡ lông rụng</p>
                </div>
                <Separator className="my-4" />
              </div>

              <div className="rounded-xl">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800 mb-2">
                      Đặt cún đi dạo
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dắt chó đi dạo hàng ngày
                    </p>
                  </div>
                  <Separator className="my-4" />
                </div>
              </div>
              <div className="rounded-xl">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800 mb-2">
                      Huấn luyện cơ bản
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dạy các lệnh cơ bản như ngồi, nằm, đứng yên, không sủa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>*/}
    </div>
  );
}
