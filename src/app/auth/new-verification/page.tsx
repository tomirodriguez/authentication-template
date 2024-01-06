import { VerificationTokenCard } from "@/components/auth/verification-token-card";

export default function NewVerificationPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <VerificationTokenCard token={searchParams.token} />;
}
