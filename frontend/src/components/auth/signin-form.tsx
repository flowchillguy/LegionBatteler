import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import signUpImg from "@/assets/placeholderSignUp.jpg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const signInSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 kí tự!")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập không được chứa khoảng trắng và kí tự đặc biệt!",
    ),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự!"),
});

type SignUpFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signInSchema),
  });

  // Quản lý trạng thái hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: SignUpFormValues) => {
    // Gọi api tới backend để signin
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">ĐĂNG NHẬP</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Chào mừng quay trở lại.
                </p>
              </div>

              <Field>
                {/* USERNAME */}
                <FieldLabel htmlFor="username">Tên Đăng Nhập</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="toibingu"
                  {...register("username")}
                />

                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username?.message}
                  </p>
                )}
              </Field>

              {/* MẬT KHẨU */}
              <Field>
                <Field>
                  <FieldLabel htmlFor="password">Mật Khẩu</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-destructive text-sm">
                      {errors.password?.message}
                    </p>
                  )}
                </Field>
              </Field>

              {/* NÚT ĐĂNG NHẬP */}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  Đăng nhập
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Bạn chưa có tài khoản?
              </FieldSeparator>
              <FieldDescription className="text-center">
                <a href="/signup">Đăng kí</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={signUpImg}
              alt="Image"
              className=" absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-blance text-xs">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
