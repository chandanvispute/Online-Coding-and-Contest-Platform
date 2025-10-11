package com.codeplatform.backend.service;

import org.springframework.stereotype.Service;

@Service
public class BoilerplateService {
    
    public String getBoilerplateCode(String languageName) {
        switch (languageName.toLowerCase()) {
            case "java":
                return getJavaBoilerplate();
            case "python":
                return getPythonBoilerplate();
            case "c++":
                return getCppBoilerplate();
            default:
                return "// Write your code here";
        }
    }
    
    private String getJavaBoilerplate() {
        return "import java.util.*;\n\n" +
               "public class Solution {\n" +
               "    public static void main(String[] args) {\n" +
               "        Scanner sc = new Scanner(System.in);\n" +
               "        \n" +
               "        // Read input here\n" +
               "        \n" +
               "        // Write your solution here\n" +
               "        \n" +
               "        // Print output here\n" +
               "        \n" +
               "        sc.close();\n" +
               "    }\n" +
               "}";
    }
    
    private String getPythonBoilerplate() {
        return "# Read input here\n\n" +
               "# Write your solution here\n\n" +
               "# Print output here\n";
    }
    
    private String getCppBoilerplate() {
        return "#include <iostream>\n" +
               "#include <vector>\n" +
               "#include <string>\n" +
               "#include <algorithm>\n" +
               "using namespace std;\n\n" +
               "int main() {\n" +
               "    // Read input here\n" +
               "    \n" +
               "    // Write your solution here\n" +
               "    \n" +
               "    // Print output here\n" +
               "    \n" +
               "    return 0;\n" +
               "}";
    }
}