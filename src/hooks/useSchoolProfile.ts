"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SchoolProfile } from "@/schemas/school_profiles";

export function useSchoolProfile() {
  const { data: session } = useSession();
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!session?.user?.tenantId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/school-profile?tenantId=${session.user.tenantId}`
        );

        if (response.ok) {
          const data = await response.json();
          setSchoolProfile(data.profile);
        } else {
          setError("Failed to fetch school profile");
        }
      } catch (err) {
        console.error("Error fetching school profile:", err);
        setError("Error fetching school profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.tenantId]);

  return { schoolProfile, loading, error };
}
