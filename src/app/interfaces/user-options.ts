export interface UserOptions {
  email: string;
  password: string;
}

export interface RegistrationInput {
  name: string;
  surname: string;
  about: string;
  email: string;
  password: string;
  passwordConfirm: string;
  type: "USER" | "SPECIALIST",
  subType: "DEFAULT" | "DOCTOR" | "PSYCHOLOGIST" | "LAWYER";
  isAnonymous: boolean;
}
