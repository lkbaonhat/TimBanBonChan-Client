import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

function ManageVolunteer() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')



  return (
    <div>
      <div>
        <div>
          <h1 className='text-2xl font-bold'>Quản lý tình nguyện viên</h1>
          <p className='text-sm text-muted-foreground'>Quản lý và theo dõi tất cả tình nguyện viên</p>
        </div>
      </div>
      <div className='rounded-md border bg-white'>
        <div className="flex flex-col md:flex-row gap-4 p-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, giống, địa điểm..."
              className="pl-8 h-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loại thú cưng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="dog">Chó</SelectItem>
              <SelectItem value="cat">Mèo</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="available">Có sẵn</SelectItem>
              <SelectItem value="pending">Đang xử lý</SelectItem>
              <SelectItem value="adopted">Đã nhận nuôi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}


export default ManageVolunteer