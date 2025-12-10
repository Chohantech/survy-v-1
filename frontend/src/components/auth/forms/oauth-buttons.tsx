import { authClient } from "@/lib/auth-client";

const OAuthButtons = () => {
  return (
    <div className="space-y-4">
      <button
        type="button"
        aria-label="Continue with Google"
        className="w-full h-14 2xl:h-[56px] cursor-pointer rounded-full border border-[#B7C0CE] bg-transparent flex items-center gap-3 px-4 hover:bg-muted/20 transition-colors"
        onClick={() => authClient.signIn.social({ provider: "google" })}
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full">
          {/* Google G */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12S17.373 12 24 12c3.058 0 5.842 1.154 7.961 3.039l5.657-5.657C33.846 6.053 29.136 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.305 14.691l6.571 4.818C14.46 16.084 18.88 12 24 12c3.058 0 5.842 1.154 7.961 3.039l5.657-5.657C33.846 6.053 29.136 4 24 4 16.318 4 9.656 8.337 6.305 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.176 0 9.824-1.977 13.357-5.197l-6.164-5.214C29.17 35.846 26.72 36.999 24 37c-5.2 0-9.616-3.317-11.273-7.946l-6.54 5.037C9.49 39.556 16.14 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.79 2.232-2.257 4.166-4.11 5.589l.003-.002 6.164 5.214C35.122 40.355 40 37 42 32c1.238-2.309 1.611-4.655 1.611-7.917 0-1.341-.138-2.651-.389-3.917z"
            />
          </svg>
        </span>
        <span className="mx-auto text-[17px] 2xl:text-lg font-medium text-[#637487]">
          Continue with Google
        </span>
      </button>
      <button
        type="button"
        aria-label="Continue with Facebook"
        className="w-full h-14 2xl:h-[56px] cursor-pointer rounded-full border border-[#B7C0CE] bg-transparent flex items-center gap-3 px-4 hover:bg-muted/20 transition-colors"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1877F2]">
          {/* Facebook f */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 4.997 3.657 9.141 8.438 9.94v-7.03H7.898V12.06h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.47h-1.26c-1.243 0-1.63.774-1.63 1.568v1.919h2.773l-.443 2.909h-2.33v7.03C18.343 21.201 22 17.057 22 12.06z"
              fill="#fff"
            />
          </svg>
        </span>
        <span className="mx-auto text-[17px] 2xl:text-lg font-medium text-[#637487]">
          Continue with Facebook
        </span>
      </button>
    </div>
  );
};

export default OAuthButtons;
