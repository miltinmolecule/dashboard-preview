"use client";

import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { getSocket } from "@/lib/socket";
import type { Vehicle } from "../services/vehicles.service";

export function useVehiclesRealtime(
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>,
  setConnected: (v: boolean) => void,
  onRowUpdate: (vehicleId: string) => void,
  onDeleted: (vehicleId: string, plateNumber: string) => void,
): void {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onStatusUpdated = ({
      vehicleId,
      status,
    }: {
      vehicleId: string;
      status: Vehicle["status"];
    }) => {
      onRowUpdate(vehicleId);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status } : v)),
      );
    };

    const onVerificationUpdated = ({
      vehicleId,
      verificationStatus,
    }: {
      vehicleId: string;
      verificationStatus: Vehicle["verificationStatus"];
    }) => {
      onRowUpdate(vehicleId);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, verificationStatus } : v)),
      );
    };

    const onDriverAssigned = ({
      vehicleId,
      driver,
    }: {
      vehicleId: string;
      driver: Vehicle["driver"];
    }) => {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, driver } : v)),
      );
    };

    const onVehicleDeleted = ({
      vehicleId,
    }: {
      vehicleId: string;
    }) => {
      setVehicles((prev) => {
        const target = prev.find((v) => v.id === vehicleId);
        if (target) onDeleted(vehicleId, target.plateNumber);
        return prev.filter((v) => v.id !== vehicleId);
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("vehicle:status_updated", onStatusUpdated);
    socket.on("vehicle:verification_updated", onVerificationUpdated);
    socket.on("vehicle:driver_assigned", onDriverAssigned);
    socket.on("vehicle:deleted", onVehicleDeleted);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("vehicle:status_updated", onStatusUpdated);
      socket.off("vehicle:verification_updated", onVerificationUpdated);
      socket.off("vehicle:driver_assigned", onDriverAssigned);
      socket.off("vehicle:deleted", onVehicleDeleted);
      socket.disconnect();
    };
  }, [setVehicles, setConnected, onRowUpdate, onDeleted]);
}