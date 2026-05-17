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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signUpSchema = z
  .object({
    firstname: z.string().min(1, "Tên bắt buộc phải có!"),
    lastname: z.string().min(1, "Họ và tên đệm bắt buộc phải có!"),
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 kí tự!")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên đăng nhập không được chứa khoảng trắng và kí tự đặc biệt!",
      ),
    email: z.email("Email không hợp lệ!"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự!"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Quản lý trạng thái hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: SignUpFormValues) => {
    const { firstname, lastname, username, email, password, confirmPassword } =
      data;
    // Gọi api tới backend để signup
    const isSuccess = await signUp(
      username,
      password,
      confirmPassword,
      email,
      firstname,
      lastname,
    );

    if (isSuccess) {
      navigate("/signin");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">ĐĂNG KÍ MỚI</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Điền đầy đủ thông tin bên dưới để tạo tài khoản
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

                <FieldDescription>
                  Tên đăng nhập phải có ít nhất 3 kí tự.
                </FieldDescription>
              </Field>

              {/* MẬT KHẨU */}
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Mật Khẩu</FieldLabel>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                    />

                    {errors.password && (
                      <p className="text-destructive text-sm">
                        {errors.password?.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Xác Nhận Mật Khẩu
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="text-destructive text-sm">
                        {errors.confirmPassword?.message}
                      </p>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Mật khẩu phải có ít nhất 6 kí tự.
                </FieldDescription>
              </Field>

              {/* ĐIỀN HỌ VÀ TÊN */}
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="lastname">Họ Và Tên Đệm</FieldLabel>
                    <Input
                      id="lastname"
                      type="text"
                      placeholder="NGUYỄN VĂN"
                      {...register("lastname")}
                    />

                    {errors.lastname && (
                      <p className="text-destructive text-sm">
                        {errors.lastname?.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firstname">Tên</FieldLabel>
                    <Input
                      id="firstname"
                      type="text"
                      placeholder="A"
                      {...register("firstname")}
                    />

                    {errors.firstname && (
                      <p className="text-destructive text-sm">
                        {errors.firstname?.message}
                      </p>
                    )}
                  </Field>
                </Field>

                <FieldDescription>
                  Đây sẽ là tên hiển thị trong trò chơi.
                </FieldDescription>
              </Field>

              {/* EMAIL */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="toibingu@toidongtinh.com"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email?.message}
                  </p>
                )}

                <FieldDescription>
                  Chúng tôi sẽ sử dụng thông tin này để liên hệ với bạn. Chúng
                  tôi sẽ không chia sẻ email của bạn với bất kỳ ai khác.
                </FieldDescription>
              </Field>

              {/* NÚT ĐĂNG KÍ */}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  Đăng kí
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card"></FieldSeparator>
              <FieldDescription className="text-center">
                Bạn đã có tài khoản? <a href="/signin">Đăng nhập</a>
                <br />
                Bạn không muốn đăng kí? <a href="/trial">Chơi thử</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="./authPublic/placeholderSignUp.jpg"
              alt="Image"
              className=" absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
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
