ALTER TABLE "gym_photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "gym_photos" ALTER COLUMN "url" SET DATA TYPE varchar(500);--> statement-breakpoint
CREATE POLICY "edit-gym-policy" ON "gym_photos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)) WITH CHECK ((select auth.uid()) IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid));--> statement-breakpoint
CREATE POLICY "delete-gym-policy" ON "gym_photos" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid));--> statement-breakpoint
CREATE POLICY "select-gym-policy" ON "gym_photos" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-gym-policy" ON "gym_photos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid));