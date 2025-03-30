"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import axiosClient from "@/axios-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/api/useAuth";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ResetPasswordSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
});

const FormResetPasswordSchema = z
  .object({
    recoveryCode: z.string().min(1, "Vui lòng nhập mã khôi phục"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu mới"),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu mới"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
type FormResetPasswordForm = z.infer<typeof FormResetPasswordSchema>;

function FormResetPassword({ email }: { email: string }) {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowRePassword, setIsShowRePassword] = useState(false);

  const resetPasswordMutation = useResetPassword();

  const { handleSubmit, register, formState } = useForm<FormResetPasswordForm>({
    resolver: zodResolver(FormResetPasswordSchema),
  });

  const onSubmit = (data: FormResetPasswordForm) => {
    resetPasswordMutation.mutate(
      {
        email,
        recoveryCode: data.recoveryCode,
        newPassword: data.password,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: data.messages[0],
              variant: "default",
            });
            router.push("/login");
          } else {
            toast({
              title: data.messages[0],
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="recoveryCode" className="text-gray-700 font-medium">
          Mã khôi phục
        </Label>
        <Input
          id="recoveryCode"
          placeholder="Nhập mã khôi phục"
          className="h-11 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
          {...register("recoveryCode")}
        />
        {formState.errors.recoveryCode && (
          <p className="text-sm text-red-500">
            {formState.errors.recoveryCode.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium">
          Mật khẩu mới
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={isShowPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            className="h-11 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isShowPassword ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeClosedIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {formState.errors.password && (
          <p className="text-sm text-red-500">
            {formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
          Xác nhận mật khẩu mới
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={isShowRePassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            className="h-11 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 pr-10"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setIsShowRePassword(!isShowRePassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isShowRePassword ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeClosedIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200"
      >
        {resetPasswordMutation.isPending ? <LoadingIndicator /> : "Xác nhận"}
      </Button>
    </form>
  );
}

export default function Page() {
  const [isValidated, setIsValidated] = useState(false);

  const { handleSubmit, register, formState, getValues } =
    useForm<ResetPasswordForm>({
      resolver: zodResolver(ResetPasswordSchema),
    });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const response = await axiosClient.post(
        "/account/send-email-forgot-password",
        JSON.stringify(data.email),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.isSuccess) {
        setIsValidated(true);
        toast({
          title: "Mã khôi phục đã được gửi đến email của bạn",
          variant: "default",
        });
      } else {
        toast({
          title: response.data.messages[0],
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log({ error });
      toast({
        title: "Đã xảy ra lỗi khi gửi email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg border-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isValidated
              ? "Nhập mã khôi phục và mật khẩu mới"
              : "Nhập email để nhận mã khôi phục"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isValidated ? (
            <FormResetPassword email={getValues("email")} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="nhap@email.com"
                  className="h-11 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                  {...register("email")}
                />
                {formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng nhập
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Gửi mã khôi phục
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
