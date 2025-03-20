"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import LoadingIndicator from "@/app/components/LoadingIndicator";

// Hooks and Utilities
import { useRegister, useRegisterOTP } from "@/hooks/api/useAuth";
import { toast } from "@/hooks/use-toast";
import axiosClient from "@/axios-client";

// Schema
const RegisterSchema = z
  .object({
    email: z.string().email("Vui lòng nhập email hợp lệ"),
    firstName: z.string().min(1, "Vui lòng nhập tên"),
    lastName: z.string().min(1, "Vui lòng nhập họ"),
    phoneNumber: z
      .string()
      .min(9, "Số điện thoại phải có ít nhất 9 số")
      .regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Mật khẩu không khớp",
    path: ["rePassword"],
  });

type RegisterForm = z.infer<typeof RegisterSchema>;

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const registerMutation = useRegister();
  const registerOTPMutation = useRegisterOTP();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      rePassword: "",
    },
  });

  // Handle registration form submission
  const onSubmit = (data: RegisterForm) => {
    setEmail(data.email);
    registerMutation.mutate(
      {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            toast({
              title: "Mã OTP đã được gửi đến email của bạn",
              description: "Vui lòng kiểm tra hộp thư hoặc thư rác",
              variant: "default",
            });
            setStep(2);
          } else {
            toast({
              title: "Đăng ký thất bại",
              description: response.messages[0],
              variant: "destructive",
            });
          }
        },
        onError: () => {
          toast({
            title: "Đã xảy ra lỗi",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Handle OTP submission
  const submitOTP = () => {
    registerOTPMutation.mutate(
      {
        email,
        verifyCode: otp,
      },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            toast({
              title: "Đăng ký thành công!",
              variant: "default",
            });
            router.push("/login");
          } else {
            toast({
              title: "Mã OTP không hợp lệ",
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  // Resend OTP
  const resendOTP = async () => {
    try {
      const response = await axiosClient.post(
        `account/send-email-for-activeCode?email=${email}`
      );
      if (response.data.isSuccess) {
        toast({
          title: "Mã OTP đã được gửi lại",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Không thể gửi lại OTP",
        variant: "destructive",
      });
      console.error("Failed to resend OTP:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {step === 1 && (
        <Card className="w-full max-w-md shadow-lg border-none">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Đăng ký</h1>
              <p className="mt-2 text-sm text-gray-600">
                Tạo tài khoản để bắt đầu trải nghiệm
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nhap@email.com"
                  className="h-11 focus:ring-2 focus:ring-blue-500"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-700 font-medium"
                  >
                    Họ
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Nguyễn"
                    className="h-11 focus:ring-2 focus:ring-blue-500"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-700 font-medium"
                  >
                    Tên
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Văn A"
                    className="h-11 focus:ring-2 focus:ring-blue-500"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-gray-700 font-medium"
                >
                  Số điện thoại
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +84
                  </span>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="123456789"
                    className="h-11 rounded-l-none focus:ring-2 focus:ring-blue-500"
                    {...register("phoneNumber")}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 pr-10 focus:ring-2 focus:ring-blue-500"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rePassword"
                  className="text-gray-700 font-medium"
                >
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="rePassword"
                    type={showRePassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 pr-10 focus:ring-2 focus:ring-blue-500"
                    {...register("rePassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowRePassword(!showRePassword)}
                  >
                    {showRePassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.rePassword && (
                  <p className="text-sm text-red-500">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? <LoadingIndicator /> : "Đăng ký"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-red-600 hover:underline font-medium"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full max-w-md shadow-lg border-none">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Xác nhận OTP</h1>
              <p className="mt-2 text-sm text-gray-600">
                Nhập mã OTP được gửi đến {email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-12 h-12 text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-center text-sm text-gray-600">
                Chưa nhận được mã?{" "}
                <button
                  onClick={resendOTP}
                  className="text-red-600 hover:underline font-medium"
                >
                  Gửi lại OTP
                </button>
              </div>

              <Button
                onClick={submitOTP}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                disabled={registerOTPMutation.isPending || otp.length < 6}
              >
                {registerOTPMutation.isPending ? (
                  <LoadingIndicator />
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
