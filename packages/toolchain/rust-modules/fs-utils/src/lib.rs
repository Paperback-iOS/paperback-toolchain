use neon::prelude::*;

use std::fs;
use std::io;
use std::path::Path;


fn delete_folder_recursive(path: &Path) -> io::Result<()> {
    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let path = entry.path();

            delete_folder_recursive(&path)?;
        }
        fs::remove_dir(path)?;
    } else {
        fs::remove_file(path)?;
    }

    Ok(())
}
fn delete_folder_recursive_node_wrap(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let path = cx.argument::<JsString>(0)?.value(&mut cx);
    let path = Path::new(&path);
    
    if !path.exists() {
        return Ok(cx.undefined());
    }

    delete_folder_recursive(path).unwrap();
    Ok(cx.undefined())   
}

fn copy_folder_recursive(source: &Path, target: &Path) -> io::Result<()> {
    if !source.exists() {
        return Ok(());
    }

    let target_path = std::path::Path::new(target).join(source.file_name().unwrap());
    fs::create_dir_all(&target_path)?;

    let entries = fs::read_dir(source)?;

    for entry in entries {
        let entry = entry?;
        let entry_path = entry.path();

        if entry_path.is_dir() {
            copy_folder_recursive(&entry_path, &target_path)?;
        } else {
            let target_file_path = target_path.join(entry.file_name());
            fs::copy(&entry_path, &target_file_path)?;
        }
    }

    Ok(())
}
fn copy_folder_recursive_node_wrap(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let source = cx.argument::<JsString>(0)?.value(&mut cx);
    let target = cx.argument::<JsString>(1)?.value(&mut cx);
    let source = Path::new(&source);
    let target = Path::new(&target);

    copy_folder_recursive(source, target).unwrap();

    Ok(cx.undefined())
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("deleteFolderRecursive", delete_folder_recursive_node_wrap)?;
    cx.export_function("copyFolderRecursive", copy_folder_recursive_node_wrap)?;

    Ok(())
}
