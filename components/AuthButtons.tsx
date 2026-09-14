"use client";

import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

const AuthButtons = () => {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="border px-4 py-2 rounded">
            SignIn
          </button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button className="bg-black text-white px-4 py-2 rounded">
            SignUp
          </button>
        </SignUpButton>
      </Show>

      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
};

export default AuthButtons;