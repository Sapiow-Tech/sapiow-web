"use client";

import {
  useCreateOrganization,
  useDissolveOrganization,
  useGetOrganization,
  useJoinOrganization,
  useLeaveOrganization,
  useRegenerateInviteCode,
  useRemoveOrganizationMember,
  useRespondJoinRequest,
  useUpdateOrganization,
  type OrganizationMemberPreview,
} from "@/api/organization/useOrganization";
import {
  useCreateAccountStripe,
  useUpdateBank,
} from "@/api/proBank/useBank";
import { Button } from "@/components/common/Button";
import { LoadingModal } from "@/components/common/LoadingModal";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConfirmActionModal } from "@/components/organization/ConfirmActionModal";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const outlineClassName =
  "bg-transparent text-cobalt-blue border border-light-blue-gray hover:bg-soft-ice-gray";

const inputClassName =
  "w-full border border-light-blue-gray rounded-lg px-4 py-3 disabled:bg-gray-50 disabled:cursor-not-allowed";

function memberName(member: {
  pros?: {
    first_name: string | null;
    last_name: string | null;
  };
}) {
  return [member.pros?.first_name, member.pros?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function memberInitials(member: OrganizationMemberPreview) {
  const first = member.pros?.first_name?.[0] ?? "";
  const last = member.pros?.last_name?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "?";
}

function ButtonLabelWithSpinner({
  isPending,
  pendingText,
  label,
  spinnerColor = "text-white",
}: {
  isPending: boolean;
  pendingText: string;
  label: string;
  spinnerColor?: string;
}) {
  if (!isPending) return label;
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" color={spinnerColor} />
      {pendingText}
    </div>
  );
}

function OrganizationRequestCard({
  request,
  isAccepting,
  isRefusing,
  onAccept,
  onRefuse,
}: {
  request: OrganizationMemberPreview;
  isAccepting: boolean;
  isRefusing: boolean;
  onAccept: () => void;
  onRefuse: () => void;
}) {
  const t = useTranslations("organization");
  const name = memberName(request) || t("unknownMember");
  const isBusy = isAccepting || isRefusing;

  return (
    <li className="rounded-xl bg-soft-ice-gray border border-light-blue-gray p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cobalt-blue/10 text-sm font-semibold text-cobalt-blue">
          {memberInitials(request)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-charcoal-blue truncate">{name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{t("requestPending")}</p>
          <div className="flex gap-2 mt-3 justify-end">
            <Button
              label={
                <ButtonLabelWithSpinner
                  isPending={isRefusing}
                  pendingText={t("processing")}
                  label={t("refuse")}
                  spinnerColor="text-cobalt-blue"
                />
              }
              className={`${outlineClassName} px-4 py-2`}
              onClick={onRefuse}
              disabled={isBusy}
            />
            <Button
              label={
                <ButtonLabelWithSpinner
                  isPending={isAccepting}
                  pendingText={t("processing")}
                  label={t("accept")}
                />
              }
              className="px-4 py-2"
              onClick={onAccept}
              disabled={isBusy}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

function OrganizationProfileHeader({
  name,
  description,
  imageUrl,
}: {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}) {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";

  return (
    <div className="text-center space-y-3">
      {imageUrl ? (
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border border-light-blue-gray">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-cobalt-blue/10 flex items-center justify-center mx-auto text-2xl font-bold text-cobalt-blue">
          {initial}
        </div>
      )}
      <h2 className="text-xl font-bold text-charcoal-blue">{name}</h2>
      {description ? (
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{description}</p>
      ) : null}
    </div>
  );
}

function OrganizationTeamList({
  members,
}: {
  members: OrganizationMemberPreview[];
}) {
  const t = useTranslations("organization");
  const owners = members.filter((m) => m.role === "owner");
  const teamMembers = members.filter((m) => m.role === "member");

  return (
    <section className="space-y-3">
      <h3 className="font-medium text-charcoal-blue">{t("team")}</h3>
      <ul className="space-y-2">
        {owners.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-3 border border-light-blue-gray rounded-lg px-4 py-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cobalt-blue/10 text-sm font-semibold text-cobalt-blue overflow-hidden">
              {member.pros?.avatar ? (
                <Image
                  src={member.pros.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                  unoptimized
                />
              ) : (
                memberInitials(member)
              )}
            </div>
            <div>
              <p className="font-medium">
                {memberName(member) || t("unknownMember")}
              </p>
              <p className="text-xs text-gray-500">{t("ownerRole")}</p>
            </div>
          </li>
        ))}
        {teamMembers.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-3 border border-light-blue-gray rounded-lg px-4 py-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cobalt-blue/10 text-sm font-semibold text-cobalt-blue overflow-hidden">
              {member.pros?.avatar ? (
                <Image
                  src={member.pros.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                  unoptimized
                />
              ) : (
                memberInitials(member)
              )}
            </div>
            <div>
              <p className="font-medium">
                {memberName(member) || t("unknownMember")}
              </p>
              <p className="text-xs text-gray-500">{t("memberRole")}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PendingApplicantView({
  organizationName,
  onRefresh,
}: {
  organizationName: string;
  onRefresh: () => void;
}) {
  const t = useTranslations("organization");

  return (
    <div className="max-w-md">
      <div className="rounded-2xl border border-light-blue-gray bg-soft-ice-gray p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cobalt-blue/10">
          <Clock className="h-7 w-7 text-cobalt-blue" />
        </div>
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
          {t("pendingBadge")}
        </span>
        {organizationName && (
          <h2 className="text-xl font-bold text-charcoal-blue">
            {organizationName}
          </h2>
        )}
        <p className="text-sm text-gray-600">
          {t("pendingDescription", { name: organizationName })}
        </p>
        <Button
          label={t("refresh")}
          className={`${outlineClassName} w-full`}
          onClick={onRefresh}
        />
      </div>
    </div>
  );
}

export default function OrganizationPanel() {
  useProtectedPage({ allowedUserTypes: ["expert"] });
  const t = useTranslations("organization");
  const tBank = useTranslations("bankAccount");
  const { data, isLoading, refetch } = useGetOrganization();
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();
  const joinOrganization = useJoinOrganization();
  const regenerateCode = useRegenerateInviteCode();
  const respondRequest = useRespondJoinRequest();
  const removeMember = useRemoveOrganizationMember();
  const leaveOrganization = useLeaveOrganization();
  const dissolveOrganization = useDissolveOrganization();
  const { mutate: createStripeAccount } = useCreateAccountStripe();
  const { mutate: updateBank } = useUpdateBank();

  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDissolveModal, setShowDissolveModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] =
    useState<OrganizationMemberPreview | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const organizationFromData = data?.organization;

  const handleConfigureStripe = () => {
    const hasStripeAccount =
      data?.stripe?.status === "valid" ||
      data?.stripe?.status === "waiting_for_validation";

    setIsStripeLoading(true);

    if (hasStripeAccount) {
      updateBank(
        {},
        {
          onSuccess(response) {
            if (response?.onboarding_url) {
              window.location.href = response.onboarding_url;
            } else {
              setIsStripeLoading(false);
            }
          },
          onError() {
            setIsStripeLoading(false);
          },
        },
      );
    } else {
      createStripeAccount(undefined, {
        onSuccess(response) {
          if (response.onboarding_url) {
            window.location.href = response.onboarding_url;
          } else {
            setIsStripeLoading(false);
          }
        },
        onError() {
          setIsStripeLoading(false);
        },
      });
    }
  };

  useEffect(() => {
    if (organizationFromData) {
      setEditName(organizationFromData.name);
      setEditDescription(organizationFromData.description ?? "");
      setImageFile(null);
      setImagePreview(null);
      setRemoveImage(false);
    }
  }, [
    organizationFromData?.id,
    organizationFromData?.name,
    organizationFromData?.description,
    organizationFromData?.image_url,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingScreen message={t("loading")} size="md" fullScreen={false} />
      </div>
    );
  }

  const membership = data?.membership;
  const organization = data?.organization;
  const isOwner =
    membership?.role === "owner" && membership?.status === "active";
  const isMember =
    membership?.role === "member" && membership?.status === "active";
  const isPending = membership?.status === "pending" || data?.pending;
  const isSubmitting =
    createOrganization.isPending || joinOrganization.isPending;

  if (!organization && !membership) {
    return (
      <div className="space-y-8 max-w-xl">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-blue">
            {t("createTitle")}
          </h2>
          <p className="text-sm text-gray-600">{t("createDescription")}</p>
          <input
            className={inputClassName}
            placeholder={t("namePlaceholder")}
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            disabled={isSubmitting}
          />
          <textarea
            className={`${inputClassName} min-h-[100px] resize-y`}
            placeholder={t("descriptionPlaceholder")}
            value={orgDescription}
            onChange={(e) => setOrgDescription(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            label={
              <ButtonLabelWithSpinner
                isPending={createOrganization.isPending}
                pendingText={t("creating")}
                label={t("createButton")}
              />
            }
            onClick={() =>
              createOrganization.mutate({
                name: orgName,
                description: orgDescription.trim() || null,
              })
            }
            disabled={!orgName.trim() || isSubmitting}
          />
        </section>

        <div className="border-t border-light-blue-gray pt-8 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-blue">
            {t("joinTitle")}
          </h2>
          <p className="text-sm text-gray-600">{t("joinDescription")}</p>
          <input
            className={`${inputClassName} uppercase`}
            placeholder={t("codePlaceholder")}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            disabled={isSubmitting}
          />
          <Button
            label={
              <ButtonLabelWithSpinner
                isPending={joinOrganization.isPending}
                pendingText={t("processing")}
                label={t("joinButton")}
                spinnerColor="text-cobalt-blue"
              />
            }
            className={outlineClassName}
            onClick={() => joinOrganization.mutate({ code: joinCode })}
            disabled={!joinCode.trim() || isSubmitting}
          />
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <PendingApplicantView
        organizationName={organization?.name ?? ""}
        onRefresh={() => refetch()}
      />
    );
  }

  if (isMember) {
    return (
      <>
        <div className="max-w-xl space-y-6">
          <OrganizationProfileHeader
            name={organization?.name ?? ""}
            description={organization?.description}
            imageUrl={organization?.image_url}
          />
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
            {t("memberPaymentsInfo", { name: organization?.name ?? "" })}
          </div>
          {(data?.members?.length ?? 0) > 0 && (
            <OrganizationTeamList members={data?.members ?? []} />
          )}
          <button
            type="button"
            onClick={() => setShowLeaveModal(true)}
            disabled={leaveOrganization.isPending}
            className="text-red-500 font-semibold hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {t("leaveButton")}
          </button>
        </div>

        <ConfirmActionModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          isPending={leaveOrganization.isPending}
          title={t("leaveConfirmTitle")}
          message={t("leaveConfirmMessage")}
          confirmLabel={t("leaveConfirm")}
          onConfirm={() => {
            leaveOrganization.mutate(undefined, {
              onSuccess: () => setShowLeaveModal(false),
            });
          }}
        />
      </>
    );
  }

  if (isOwner && organization) {
    const activeRequestId = respondRequest.isPending
      ? respondRequest.variables?.requestId
      : null;
    const activeAction = respondRequest.isPending
      ? respondRequest.variables?.action
      : null;
    const removingProId = removeMember.isPending
      ? removeMember.variables
      : null;

    return (
      <>
        <LoadingModal
          isOpen={isStripeLoading}
          message={tBank("preparingRedirect")}
        />
        <div className="space-y-8 max-w-2xl">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-charcoal-blue">
              {t("ownerTitle")}
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-light-blue-gray shrink-0">
                {imagePreview || (!removeImage && organization.image_url) ? (
                  <Image
                    src={imagePreview ?? organization.image_url!}
                    alt={organization.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-cobalt-blue/10 flex items-center justify-center text-2xl font-bold text-cobalt-blue">
                    {organization.name[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageFile(file);
                    setRemoveImage(false);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
                <Button
                  label={t("changeImage")}
                  className={`${outlineClassName} px-4 py-2`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={updateOrganization.isPending}
                />
                {(organization.image_url || imagePreview) && !removeImage && (
                  <Button
                    label={t("removeImage")}
                    className={`${outlineClassName} px-4 py-2`}
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setRemoveImage(true);
                    }}
                    disabled={updateOrganization.isPending}
                  />
                )}
              </div>
            </div>

            <input
              className={inputClassName}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={updateOrganization.isPending}
            />
            <textarea
              className={`${inputClassName} min-h-[100px] resize-y`}
              placeholder={t("descriptionPlaceholder")}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={updateOrganization.isPending}
            />
            <Button
              label={
                <ButtonLabelWithSpinner
                  isPending={updateOrganization.isPending}
                  pendingText={t("processing")}
                  label={t("save")}
                />
              }
              onClick={() =>
                updateOrganization.mutate({
                  name: editName || organization.name,
                  description: editDescription.trim() || null,
                  image: imageFile,
                  removeImage,
                })
              }
              disabled={updateOrganization.isPending}
            />
          </section>

          <section className="space-y-3">
            <h3 className="font-medium text-charcoal-blue">
              {t("organizationStripeStatus")}
            </h3>
            <div className="rounded-lg border border-light-blue-gray bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {data?.stripe?.status === "valid" ||
                data?.stripe?.status === "waiting_for_validation" ? (
                  <div className="w-9 h-9 bg-[#5B56F6] rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-white font-normal text-[10px]">
                      Stripe
                    </span>
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <Image
                      src="/assets/icons/stripe.svg"
                      alt="Stripe"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {t("organizationStripeBadge")}
                  </div>
                  <div
                    className={`text-xs ${
                      data?.stripe?.status === "valid"
                        ? "text-green-600"
                        : data?.stripe?.status === "waiting_for_validation"
                          ? "text-amber-600"
                          : "text-gray-500"
                    }`}
                  >
                    {data?.stripe?.status === "valid"
                      ? t("organizationStripeValid")
                      : data?.stripe?.status === "waiting_for_validation"
                        ? t("organizationStripePending")
                        : t("organizationStripeNotConfigured")}
                  </div>
                </div>
              </div>
              <Button
                label={
                  isStripeLoading
                    ? tBank("inProgress")
                    : t("configureStripe")
                }
                onClick={handleConfigureStripe}
                disabled={isStripeLoading}
                className="border border-light-blue-gray hover:text-white rounded-full text-exford-blue font-bold font-figtree px-4 py-2 bg-transparent text-sm shadow-none"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-medium text-charcoal-blue">{t("inviteCode")}</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="px-4 py-2 bg-gray-100 rounded-lg text-lg tracking-widest">
                {organization.invite_code}
              </code>
              <Button
                label={t("copy")}
                className={outlineClassName}
                onClick={() => {
                  if (organization.invite_code) {
                    navigator.clipboard.writeText(organization.invite_code);
                  }
                }}
              />
              <Button
                label={
                  <ButtonLabelWithSpinner
                    isPending={regenerateCode.isPending}
                    pendingText={t("processing")}
                    label={t("regenerate")}
                    spinnerColor="text-cobalt-blue"
                  />
                }
                className={outlineClassName}
                onClick={() => regenerateCode.mutate()}
                disabled={regenerateCode.isPending}
              />
            </div>
            <p className="text-sm text-gray-600">{t("inviteCodeHelp")}</p>
          </section>

          {(data?.pending_requests?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-medium text-charcoal-blue">{t("requests")}</h3>
              <ul className="space-y-3">
                {data?.pending_requests?.map((request) => (
                  <OrganizationRequestCard
                    key={request.id}
                    request={request}
                    isAccepting={
                      activeRequestId === request.id &&
                      activeAction === "accept"
                    }
                    isRefusing={
                      activeRequestId === request.id &&
                      activeAction === "refuse"
                    }
                    onAccept={() =>
                      respondRequest.mutate({
                        requestId: request.id,
                        action: "accept",
                      })
                    }
                    onRefuse={() =>
                      respondRequest.mutate({
                        requestId: request.id,
                        action: "refuse",
                      })
                    }
                  />
                ))}
              </ul>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="font-medium text-charcoal-blue">{t("members")}</h3>
            <ul className="space-y-2">
              {data?.members?.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between border border-light-blue-gray rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {memberName(member) || t("unknownMember")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.role === "owner"
                        ? t("ownerRole")
                        : t("memberRole")}
                    </p>
                  </div>
                  {member.role === "member" && (
                    <button
                      type="button"
                      onClick={() => setMemberToRemove(member)}
                      disabled={removeMember.isPending}
                      className="text-red-500 font-semibold hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                      {removingProId === member.pro_id ? (
                        <>
                          <LoadingSpinner
                            size="sm"
                            color="text-red-500"
                          />
                          {t("processing")}
                        </>
                      ) : (
                        t("remove")
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-light-blue-gray pt-6">
            <button
              type="button"
              onClick={() => setShowDissolveModal(true)}
              disabled={
                (data?.members?.filter((m) => m.role === "member").length ??
                  0) > 0
              }
              className="text-red-500 font-semibold hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {t("dissolve")}
            </button>
            {(data?.members?.filter((m) => m.role === "member").length ?? 0) >
              0 && (
              <p className="text-sm text-gray-500 mt-2">{t("dissolveHint")}</p>
            )}
          </section>
        </div>

        <ConfirmActionModal
          isOpen={showDissolveModal}
          onClose={() => setShowDissolveModal(false)}
          isPending={dissolveOrganization.isPending}
          title={t("dissolveConfirmTitle")}
          message={t("dissolveConfirmMessage")}
          warning={t("dissolveConfirmWarning")}
          confirmLabel={t("dissolveConfirm")}
          onConfirm={() => {
            dissolveOrganization.mutate(undefined, {
              onSuccess: () => setShowDissolveModal(false),
            });
          }}
        />

        <ConfirmActionModal
          isOpen={!!memberToRemove}
          onClose={() => setMemberToRemove(null)}
          isPending={removeMember.isPending}
          title={t("removeConfirmTitle")}
          message={t("removeConfirmMessage", {
            name: memberToRemove
              ? memberName(memberToRemove) || t("unknownMember")
              : "",
          })}
          confirmLabel={t("removeConfirm")}
          onConfirm={() => {
            if (!memberToRemove) return;
            removeMember.mutate(memberToRemove.pro_id, {
              onSuccess: () => setMemberToRemove(null),
            });
          }}
        />
      </>
    );
  }

  return null;
}
