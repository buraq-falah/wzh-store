"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Phone, Mail, MessageCircle, QrCode } from "lucide-react";
import Image from "next/image";

interface OrderContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

export function OrderContactModal({ open, onOpenChange, productName }: OrderContactModalProps) {
  // بيانات التواصل - استبدلها ببياناتك الحقيقية
  const phone = "+86 135-2805-6602";
  const email = "1369077523@qq.com";
  const whatsappLink = `https://wa.me/966123456789?text=Hello%2C%20I%20want%20to%20order%20${encodeURIComponent(
    productName || "this product"
  )}`;
  const qrCodeUrl = "/qr.jpg"; // استبدل برابط QR حقيقي (يمكن توليده عبر API)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Place Your Order</DialogTitle>
            <p className="text-muted-foreground mt-1">
              Complete your purchase via one of the channels below
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-gray-50 p-3 rounded-2xl shadow-inner">
              <Image
                src={qrCodeUrl}
                alt="WeChat QR Code"
                width={180}
                height={180}
                className="rounded-xl"
                unoptimized // لأن الرابط قد يكون مؤقتاً
                priority // لتحميل الصورة بسرعة عند فتح المودال
              />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <QrCode className="h-4 w-4" /> Scan to chat on WeChat
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Call us</p>
                <p className="font-medium">{phone}</p>
              </div>
            </a>

            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email us</p>
                <p className="font-medium">{email}</p>
              </div>
            </a>

          </div>

          <p className="text-xs text-center text-muted-foreground pt-2 border-t">
            We will contact you within minutes to confirm your order.
          </p>
        </div>

        <div className="bg-gray-50 p-4 text-center rounded-b-2xl">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}