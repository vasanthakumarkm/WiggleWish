use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, WebviewWindow,
};
use tauri_plugin_autostart::MacosLauncher;

#[cfg(windows)]
use windows::Win32::UI::WindowsAndMessaging::{
    GetSystemMetrics, SM_CXSCREEN,
};

#[tauri::command]
fn set_ignore_cursor_events(window: WebviewWindow, ignore: bool) -> Result<(), String> {
    window
        .set_ignore_cursor_events(ignore)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_cursor_position(window: WebviewWindow) -> Result<(i32, i32), String> {
    let pos = window.cursor_position().map_err(|e| e.to_string())?;
    Ok((pos.x as i32, pos.y as i32))
}

#[tauri::command]
fn get_screen_width() -> i32 {
    #[cfg(windows)]
    {
        unsafe { GetSystemMetrics(SM_CXSCREEN) }
    }
    #[cfg(not(windows))]
    {
        1920
    }
}

#[tauri::command]
fn center_window_top(window: WebviewWindow) -> Result<(), String> {
    let screen_width = get_screen_width();
    let window_width = 300;
    let x = (screen_width - window_width) / 2;

    window
        .set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y: 0 }))
        .map_err(|e| e.to_string())
}

fn create_tray_menu(app: &AppHandle) -> Result<Menu<tauri::Wry>, tauri::Error> {
    let choose_charm = MenuItem::with_id(app, "choose_charm", "Choose Charm", true, None::<&str>)?;
    let toggle_sound = MenuItem::with_id(app, "toggle_sound", "Toggle Sound", true, None::<&str>)?;
    let settings = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    Menu::with_items(app, &[&choose_charm, &toggle_sound, &settings, &quit])
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--autostarted"]),
        ))
        .invoke_handler(tauri::generate_handler![
            set_ignore_cursor_events,
            get_screen_width,
            center_window_top,
            get_cursor_position
        ])
        .setup(|app| {
            let handle = app.handle().clone();

            // Enable autostart by default
            use tauri_plugin_autostart::ManagerExt;
            let autostart_manager = app.autolaunch();
            if !autostart_manager.is_enabled().unwrap_or(false) {
                let _ = autostart_manager.enable();
            }

            // Position window at top-left (spans full width)
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_position(tauri::Position::Physical(
                    tauri::PhysicalPosition { x: 0, y: 0 }
                ));
                // Don't ignore cursor events - keep charm interactive
            }

            // Create tray menu
            let menu = create_tray_menu(&handle)?;

            // Build tray icon
            let _tray = TrayIconBuilder::with_id("main-tray")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(move |app, event| {
                    match event.id.as_ref() {
                        "choose_charm" => {
                            let _ = app.emit("tray-choose-charm", ());
                        }
                        "toggle_sound" => {
                            let _ = app.emit("tray-toggle-sound", ());
                        }
                        "settings" => {
                            let _ = app.emit("tray-open-settings", ());
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
