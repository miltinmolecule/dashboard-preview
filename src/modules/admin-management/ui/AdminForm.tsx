"use client";

import { useEffect, useState } from "react";
import AppInput from "@/shared/common/AppInput";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import {
  canAssignRole,
  ROLE_LABELS,
  VALID_ROLES,
  VALID_SCOPES,
  type AdminRecord,
  type AdminRole,
  type AdminScope,
  type CreateAdminDto,
  type UpdateAdminDto,
} from "../type/admin-management";
import { useCurrentAdmin } from "../hooks/useCurrentAdmin";

interface CreateProps {
  mode:        "create";
  isSubmitting: boolean;
  onClose:     () => void;
  onSubmit:    (dto: CreateAdminDto) => Promise<void>;
}

interface EditProps {
  mode:        "edit";
  admin:       AdminRecord;
  isSubmitting: boolean;
  onClose:     () => void;
  onSubmit:    (dto: UpdateAdminDto) => Promise<void>;
}

type Props = CreateProps | EditProps;

export default function AdminForm(props: Props): React.ReactNode {
  const { mode, isSubmitting, onClose, onSubmit } = props;
  const editAdmin = mode === "edit" ? props.admin : undefined;
  const { role: callerRole } = useCurrentAdmin();

  const [name,    setName]    = useState(editAdmin?.name  ?? "");
  const [email,   setEmail]   = useState(editAdmin?.email ?? "");
  const [role,    setRole]    = useState<AdminRole>(editAdmin?.role ?? "support_admin");
  const [scope,   setScope]   = useState<AdminScope>(editAdmin?.scope ?? "global");
  const [cityId,  setCityId]  = useState(editAdmin?.city_id   ?? "");
  const [cityName, setCityName] = useState(editAdmin?.city_name ?? "");
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  useEffect(() => {
    if (scope === "global") { setCityId(""); setCityName(""); }
  }, [scope]);

  const availableRoles = VALID_ROLES.filter((r) => canAssignRole(callerRole, r));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (mode === "create") {
      if (!email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errs.email = "Enter a valid email address";
    }
    if (!availableRoles.includes(role)) errs.role = "You cannot assign this role";
    if (scope === "city" && !cityId.trim()) errs.cityId = "City ID is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;
    if (mode === "create") {
      await (onSubmit as CreateProps["onSubmit"])({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        scope,
        ...(scope === "city" && cityId.trim() && { city_id: cityId.trim() }),
      });
    } else {
      await (onSubmit as EditProps["onSubmit"])({
        name:  name.trim(),
        role,
        scope,
        ...(scope === "city" && cityId.trim() && { city_id: cityId.trim() }),
      });
    }
  };

  return (
    <ModalWrapper
      open
      onClose={onClose}
      title={mode === "create" ? "Add Admin" : "Edit Admin"}
      size="md"
    >
      <div className="space-y-4">
        <AppInput
          label="Full name"
          name="name"
          placeholder="e.g. Amina Hassan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          errors={errors.name}
        />

        {mode === "create" ? (
          <AppInput
            label="Email address"
            name="email"
            type="email"
            placeholder="admin@fleexy.ng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errors={errors.email}
          />
        ) : (
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">
              Email address
            </p>
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
              {editAdmin?.email}
              <span className="ml-2 text-xs text-gray-400">(cannot be changed)</span>
            </p>
          </div>
        )}

        {/* Role */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Role</p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="w-full rounded-lg border border-gray-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {availableRoles.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
        </div>

        {/* Scope */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Scope</p>
          <div className="flex gap-3">
            {VALID_SCOPES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors ${
                  scope === s
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {s === "global" ? "Global (all cities)" : "City-specific"}
              </button>
            ))}
          </div>
        </div>

        {/* City fields */}
        {scope === "city" && (
          <div className="grid grid-cols-2 gap-3">
            <AppInput
              label="City ID"
              name="cityId"
              placeholder="e.g. city-lagos-001"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              errors={errors.cityId}
            />
            <AppInput
              label="City name"
              name="cityName"
              placeholder="e.g. Lagos"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
          </div>
        )}

        {mode === "create" && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            A temporary password will be auto-generated and sent to the admin's
            email. They will be prompted to change it on first login.
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSubmitting
              ? mode === "create" ? "Creating…" : "Saving…"
              : mode === "create" ? "Create Admin" : "Save Changes"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
