import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, AlertCircle, FileDown, FileUp, Plus, Search } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PetsTable } from './components/PetTable'
import ROUTES from '@/constants/routes'
import { useDispatch, useSelector } from 'react-redux'
import { selectorGlobal } from '@/store/modules/global/selector'

export default function PetsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const listPet = useSelector(selectorGlobal.listPet) || []
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null)
  // Check for notifications from navigation state
  useEffect(() => {
    dispatch({ type: 'GET_ALL_PETS' })

    // Check if there's a notification in location state
    if (location.state?.notification) {
      setNotification(location.state.notification)

      // Clear notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [location.state, dispatch])

  const getValueType = (param: string) => {
    switch (param) {
      case "Chó":
        return "dog"
      case "Mèo":
        return "cat"
      default:
        return "all"
    }
  }

  // Filter pets based on search term and filters
  const filteredPets = React.useMemo(() => {
    return listPet.filter(pet => {
      const matchesSearch =
        pet.petName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === 'all' || getValueType(pet.categoryName) === filterType
      const matchesStatus = filterStatus === 'all' || pet.adoptionStatus.toLowerCase() === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [listPet, searchTerm, filterType, filterStatus])

  return (
    <div>
      {notification && (
        <Alert
          variant={notification.type === 'success' ? 'default' : 'destructive'}
          className="mb-6"
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {notification.type === 'success' ? 'Thành công' : 'Lỗi'}
          </AlertTitle>
          <AlertDescription>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý thú cưng</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý và theo dõi tất cả thú cưng tại đây.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2"
            onClick={() => navigate(ROUTES.STAFF.ADD_PET)}
          >
            <Plus className="h-4 w-4" />
            Thêm thú cưng mới
          </Button>
        </div>
      </div>
      <div className="rounded-md border bg-white">
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

        <PetsTable
          pets={filteredPets}
        />
      </div>
    </div>
  )
}