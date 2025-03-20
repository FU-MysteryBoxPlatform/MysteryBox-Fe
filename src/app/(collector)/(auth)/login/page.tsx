"use client";

import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingIndicator from "@/app/components/LoadingIndicator";

// Hooks and Utilities
import { useLogin } from "@/hooks/api/useAuth";
import { toast } from "@/hooks/use-toast";
import cookie from "@/utils/cookie";
import { GlobalContext } from "@/provider/global-provider";

// Schema
const LoginSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(GlobalContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(
      {
        email: data.email.trim(),
        password: data.password,
      },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            const { token, refreshToken, account } = response.result;
            cookie.set("ACCESS_TOKEN", token);
            cookie.set("REFRESH_TOKEN", refreshToken);
            setUser(account);
            localStorage.setItem("user", JSON.stringify(account));

            toast({
              title: "Đăng nhập thành công!",
              variant: "default",
            });

            const redirectPath =
              account.mainRole === "COLLECTOR"
                ? from
                  ? `/${from}`
                  : "/"
                : "/management";
            router.push(redirectPath);
          } else {
            toast({
              title: response.messages[0],
              variant: "destructive",
            });
          }
        },
        onError: () => {
          toast({
            title: "Đã xảy ra lỗi khi đăng nhập",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Đăng nhập</h1>
            <p className="mt-2 text-sm text-gray-600">
              Chào mừng bạn trở lại! Vui lòng nhập thông tin đăng nhập
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

            <div className="flex justify-between items-center">
              <Link
                href="/reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <LoadingIndicator /> : "Đăng nhập"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-red-600 hover:underline font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
