import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { useState } from 'react'
import { PetForm, PetFormValues } from '../PetForm'


interface EditPetDialogProps {
  pet: any
  onPetUpdated: (id: number, updatedPet: any) => void
  trigger?: React.ReactNode
}

export function EditPetDialog({ pet, onPetUpdated, trigger }: EditPetDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: PetFormValues) => {
    setIsSubmitting(true)
    try {
      // In a real app, you would make an API call here
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedPet = {
        ...pet,
        ...values
      }
      
      onPetUpdated(pet.id, updatedPet)
      setOpen(false)
    } catch (error) {
      console.error('Failed to update pet:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Chỉnh sửa</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin thú cưng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết về thú cưng.
          </DialogDescription>
        </DialogHeader>
        <PetForm 
          defaultValues={{
            name: pet.name,
            image: pet.image,
            gender: pet.gender,
            age: pet.age,
            location: pet.location,
            breed: pet.breed,
            type: pet.type || 'dog',
            description: pet.description || '',
          }} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  )
}