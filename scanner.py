import os
import sys

def generate_directory_tree_string(root_dir, ignore_dirs=None, indent="", is_last=True):
    """
    Generates a string representation of the directory tree.
    """
    if ignore_dirs is None:
        ignore_dirs = []

    if os.path.basename(root_dir) in ignore_dirs:
        return ""

    # Determine the appropriate prefix for the current item
    if indent:
        if is_last:
            prefix = indent + " "
        else:
            prefix = indent + " "
    else:
        prefix = ""

    tree_string = prefix + os.path.basename(root_dir) + "/\n"

    items = sorted(os.listdir(root_dir))  # Sort for consistent output
    num_items = len(items)

    sub_items = []
    for i, item in enumerate(items):
        item_path = os.path.join(root_dir, item)
        if item in ignore_dirs:
            continue
        sub_items.append((item, item_path))

    num_sub_items = len(sub_items)
    for i, (item, item_path) in enumerate(sub_items):
        is_last_item = (i == num_sub_items - 1)
        new_indent = indent + "    "
        if os.path.isdir(item_path):
            tree_string += generate_directory_tree_string(item_path, ignore_dirs, new_indent, is_last_item)
        elif os.path.isfile(item_path):
            file_prefix = new_indent
            if is_last_item:
                file_prefix += " "
            else:
                file_prefix += " "
            tree_string += file_prefix + item + "\n"
    return tree_string

def scan_directory_with_content(root_dir, output_file, ignore_dirs=None):
    """
    Recursively scans a directory, saves the directory tree and content of files
    to an output file, excluding the script's own content and specified directories.

    Args:
        root_dir (str): The path to the root directory to scan.
        output_file (str): The path to the file where the output will be saved.
        ignore_dirs (list, optional): A list of directory names to ignore. Defaults to None.
    """
    if ignore_dirs is None:
        ignore_dirs = []

    script_path = os.path.abspath(__file__)  # Get the absolute path of the current script

    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Generate and write the directory tree
        tree_representation = generate_directory_tree_string(root_dir, ignore_dirs)
        outfile.write("DIRECTORY STRUCTURE:\n")
        outfile.write(tree_representation)
        outfile.write("-" * 40 + "\n\n")

        for root, _, files in os.walk(root_dir):
            # Skip ignored directories
            if os.path.basename(root) in ignore_dirs:
                continue
            if any(part in ignore_dirs for part in os.path.normpath(root).split(os.sep)):
                continue

            files.sort() # Sort files for consistent output

            for file in files:
                file_path = os.path.join(root, file)

                # Exclude the script itself
                if os.path.abspath(file_path) == script_path:
                    continue

                relative_path = os.path.relpath(file_path, root_dir)

                outfile.write("=" * 40 + "\n")  # Better demarcation before file
                outfile.write(f"#{relative_path}\n")

                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        content = infile.read()
                        outfile.write(content)
                except UnicodeDecodeError:
                    outfile.write(f"<<<ERROR: Could not decode file as UTF-8>>>\n")
                except Exception as e:
                    outfile.write(f"<<<ERROR: Could not read file: {e}>>>\n")

                outfile.write("\n" + "=" * 40 + "\n")  # Better demarcation after file

if __name__ == "__main__":
    target_directory = "."  # Replace with the directory you want to scan
    output_filename = "directory_content.txt"
    directories_to_ignore = ["node_modules", ".git", "__pycache__"]  # Add any other directories to ignore

    scan_directory_with_content(target_directory, output_filename, ignore_dirs=directories_to_ignore)
    print(f"Directory structure and file content saved to '{output_filename}'")
