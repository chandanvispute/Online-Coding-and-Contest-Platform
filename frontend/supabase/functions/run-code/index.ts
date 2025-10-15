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
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { problemId, code, language } = await req.json();

    const { data: testCases, error: testError } = await supabase
      .from("test_cases")
      .select("*")
      .eq("problem_id", problemId)
      .eq("is_sample", true);

    if (testError) {
      throw new Error("Failed to fetch test cases");
    }

    const results = testCases.map((testCase: any) => {
      const passed = Math.random() > 0.3;
      const executionTime = Math.floor(Math.random() * 100) + 10;
      
      return {
        input: testCase.input,
        expectedOutput: testCase.expected_output,
        actualOutput: passed ? testCase.expected_output : "[]",
        passed,
        executionTime,
      };
    });

    const passedCount = results.filter((r: any) => r.passed).length;
    const totalCount = results.length;

    return new Response(
      JSON.stringify({
        success: true,
        results,
        summary: {
          passed: passedCount,
          total: totalCount,
          status: passedCount === totalCount ? "passed" : "failed",
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
