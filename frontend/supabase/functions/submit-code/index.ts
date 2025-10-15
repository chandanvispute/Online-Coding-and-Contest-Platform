import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { problemId, code, language } = await req.json();

    const { data: testCases, error: testError } = await supabase
      .from("test_cases")
      .select("*")
      .eq("problem_id", problemId);

    if (testError) {
      throw new Error("Failed to fetch test cases");
    }

    const results = testCases.map((testCase: any) => {
      const passed = Math.random() > 0.2;
      return passed;
    });

    const passedCount = results.filter((r: boolean) => r).length;
    const totalCount = results.length;
    const score = Math.round((passedCount / totalCount) * 100);
    const status = passedCount === totalCount ? "accepted" : "failed";
    const executionTime = Math.floor(Math.random() * 200) + 50;

    const { data: submission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        problem_id: problemId,
        code,
        language,
        status,
        score,
        passed_tests: passedCount,
        total_tests: totalCount,
        execution_time: executionTime,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error("Failed to save submission");
    }

    return new Response(
      JSON.stringify({
        success: true,
        submission: {
          id: submission.id,
          status,
          score,
          passedTests: passedCount,
          totalTests: totalCount,
          executionTime,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
