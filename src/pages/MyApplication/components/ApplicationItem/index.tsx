import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VolunteerApplication {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  gender: string;
  occupation: string;
  facebookLink?: string;
  preferredRole: string;
  previousExperience?: string;
  skills?: string;
  motivation: string;
  availableDays: string;
  availableHours: string;
  applicationStatus: string;
  createdDate: string;
  modifiedDate: string;
}

interface ApplicationItemProps {
  application: VolunteerApplication;
  onViewDetails: (id: number) => void;
}

export default function ApplicationItem({ application, onViewDetails }: ApplicationItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang xử lý</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-2">
              Đơn đăng ký #{application.id}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Tạo: {formatDate(application.createdDate)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Cập nhật: {formatDate(application.modifiedDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(application.applicationStatus)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Information Summary */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Họ tên:</span>
              <p className="font-medium">{application.fullName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {application.email}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Điện thoại:</span>
              <p className="font-medium flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {application.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Role and Schedule */}
        <div>
          <h4 className="font-medium mb-3">Vai trò và Lịch trình</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Vai trò mong muốn:</span>
              <p className="font-medium">{application.preferredRole}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Thời gian:</span>
              <p className="font-medium">{application.availableDays} - {application.availableHours}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Motivation Preview */}
        <div>
          <h4 className="font-medium mb-2">Động lực tham gia</h4>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {application.motivation}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(application.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}