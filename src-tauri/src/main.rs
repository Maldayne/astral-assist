use dotenv::dotenv;
use std::env;
use tauri::Manager;
use reqwest::Client;
use serde::{ Deserialize, Serialize };
use serde_json::Value;

#[derive(Serialize, Deserialize)]
struct AIQueryRequest {
    message: String,
    system_prompt: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct AIQueryResponse {
    response: String,
}

#[tauri::command]
async fn query_claude(
    _app_handle: tauri::AppHandle,
    request: AIQueryRequest
) -> Result<AIQueryResponse, String> {
    let client = Client::new();
    let api_key = env::var("ANTHROPIC_API_KEY").map_err(|_| "ANTHROPIC_API_KEY not set")?;

    println!("API Key (first 5 characters): {}", &api_key[..5]); // Log first 5 characters of API key for debugging

    let system_prompt = request.system_prompt.unwrap_or_default();

    let response = client
        .post("https://api.anthropic.com/v1/messages")
        .header("Content-Type", "application/json")
        .header("X-API-Key", api_key)
        .header("anthropic-version", "2023-06-01")
        .json(
            &serde_json::json!({
            "model": "claude-2.1",
            "max_tokens": 300,
            "messages": [
                {
                    "role": "user",
                    "content": format!("{}\n\n{}", system_prompt, request.message)
                }
            ]
        })
        )
        .send().await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    let status = response.status();
    let body = response.text().await.map_err(|e| format!("Failed to read response body: {}", e))?;

    println!("Response status: {}", status);
    println!("Response body: {}", body);

    let json: Value = serde_json
        ::from_str(&body)
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    if !status.is_success() {
        return Err(
            format!(
                "API request failed with status {}: {}",
                status,
                json["error"]["message"].as_str().unwrap_or("Unknown error")
            )
        );
    }

    let content = json["content"][0]["text"]
        .as_str()
        .ok_or("Invalid response format: 'content' field not found or not a string")?;

    Ok(AIQueryResponse {
        response: content.to_string(),
    })
}

fn main() {
    dotenv().ok(); // Load .env file

    tauri::Builder
        ::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![query_claude])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
