"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ClassDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  classCode: string
  onConfirm: () => void
}

export function ClassDeleteDialog({
  open,
  onOpenChange,
  classCode,
  onConfirm,
}: ClassDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Xóa lớp học</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa lớp{" "}
            <strong className="text-foreground">{classCode}</strong>? Hành động
            này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
