import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import styles from "../auth-form.module.css";
import { LOGO } from "@/constants/global";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`${styles.authContainer} my-5 px-4 sm:px-6 md:my-10 md:px-0`}
    >
      <div
        className={`${styles.formCard} w-full max-w-[95%] md:max-w-[677px] p-6 md:p-12`}
      >
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <img src={LOGO.NO_TEXT} alt="logo" className="w-32 md:w-auto" />
          </div>
        </div>

        <form className={`${styles.form} px-0 sm:px-2 md:px-5`}>
          <div className={styles.inputGroup}>
            <Input
              type="text"
              placeholder="Họ và tên"
              className={`${styles.input} text-base md:text-lg py-4 md:py-6`}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              type="text"
              placeholder="Tên đăng nhập"
              className={`${styles.input} text-base md:text-lg py-4 md:py-6`}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              type="email"
              placeholder="Địa chỉ email cá nhân"
              className={`${styles.input} text-base md:text-lg py-4 md:py-6`}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className={`${styles.input} text-base md:text-lg py-4 md:py-6`}
              />
              <button
                type="button"
                className={`${styles.eyeButton} right-4`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            className={`${styles.submitButton} text-base md:text-2xl py-4 md:py-6`}
          >
            Đăng ký
          </Button>
        </form>

        <div className={`${styles.divider} my-6 md:my-10`}>
          <Separator className={styles.separator} />
          <span className={`${styles.orText} text-xl md:text-2xl px-3 md:px-6`}>
            Hoặc
          </span>
          <Separator className={styles.separator} />
        </div>

        <div className={styles.socialButtons}>
          <button
            className={`${styles.socialButton} w-10 h-10 md:w-12 md:h-12 mx-3 md:mx-8`}
          >
            <img src={LOGO.APP_LOGO} alt="app_logo" />
          </button>
          <button
            className={`${styles.socialButton} w-10 h-10 md:w-12 md:h-12 mx-3 md:mx-8`}
          >
            <img src={LOGO.GG_LOGO} alt="gg_logo" />
          </button>
          <button
            className={`${styles.socialButton} w-10 h-10 md:w-12 md:h-12 mx-3 md:mx-8`}
          >
            <img src={LOGO.FB_LOGO} alt="fb_logo" />
          </button>
        </div>

        <div
          className={`${styles.footerText} text-sm md:text-base mt-6 md:mt-8`}
        >
          <p>
            Bạn đã có tài khoản?{" "}
            <a href="#" className={styles.link}>
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
