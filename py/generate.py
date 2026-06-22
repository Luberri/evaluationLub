#!/usr/bin/env python3
"""
CRUD Generator for Spring Boot
Usage: python generate.py Zavatra.java
"""

import os
import re
import sys


def parse_java_model(filepath: str) -> dict:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Package
    pkg_match = re.search(r"^package\s+([\w.]+);", content, re.MULTILINE)
    package = pkg_match.group(1) if pkg_match else "com.example"
    base_package = re.sub(r"\.model$", "", package)

    # Class name
    class_match = re.search(r"public class (\w+)", content)
    if not class_match:
        raise ValueError("Aucune classe publique trouvée dans le fichier.")
    class_name = class_match.group(1)

    # Fields (type + name)
    fields = re.findall(r"private\s+(\w+)\s+(\w+)\s*;", content)

    return {
        "base_package": base_package,
        "class_name": class_name,
        "class_var": class_name[0].lower() + class_name[1:],
        "fields": fields,
    }


# ── Templates ────────────────────────────────────────────────────────────────

def gen_repository(info: dict) -> str:
    cn = info["class_name"]
    bp = info["base_package"]
    return f"""package {bp}.repository;

import {bp}.model.{cn};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface {cn}Repository extends JpaRepository<{cn}, Long> {{

}}
"""


def gen_service(info: dict) -> str:
    cn = info["class_name"]
    cv = info["class_var"]
    bp = info["base_package"]

    # setters pour updateXxx — on exclut "id"
    setter_lines = []
    for ftype, fname in info["fields"]:
        if fname.lower() == "id":
            continue
        setter = fname[0].upper() + fname[1:]
        setter_lines.append(
            f"            {cv}.set{setter}({cv}Details.get{setter}());"
        )
    setters = "\n".join(setter_lines)

    return f"""package {bp}.service;

import {bp}.model.{cn};
import {bp}.repository.{cn}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class {cn}Service {{

    @Autowired
    private {cn}Repository {cv}Repository;

    public List<{cn}> getAll{cn}() {{
        return {cv}Repository.findAll();
    }}

    public Optional<{cn}> get{cn}ById(Long id) {{
        return {cv}Repository.findById(id);
    }}

    public {cn} create{cn}({cn} {cv}) {{
        return {cv}Repository.save({cv});
    }}

    public Optional<{cn}> update{cn}(Long id, {cn} {cv}Details) {{
        return {cv}Repository.findById(id).map({cv} -> {{
{setters}
            return {cv}Repository.save({cv});
        }});
    }}

    public boolean delete{cn}(Long id) {{
        if ({cv}Repository.existsById(id)) {{
            {cv}Repository.deleteById(id);
            return true;
        }}
        return false;
    }}
}}
"""


def gen_controller(info: dict) -> str:
    cn = info["class_name"]
    cv = info["class_var"]
    bp = info["base_package"]
    route = cn.lower()

    return f"""package {bp}.controller;

import {bp}.model.{cn};
import {bp}.service.{cn}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/{route}")
public class {cn}Controller {{

    @Autowired
    private {cn}Service {cv}Service;

    @GetMapping
    public List<{cn}> getAll{cn}() {{
        return {cv}Service.getAll{cn}();
    }}

    @GetMapping("/{{id}}")
    public {cn} get{cn}ById(@PathVariable Long id) {{
        return {cv}Service.get{cn}ById(id)
                .orElseThrow();
    }}

    @PostMapping
    public {cn} create{cn}(@RequestBody {cn} {cv}) {{
        return {cv}Service.create{cn}({cv});
    }}

    @PutMapping("/{{id}}")
    public {cn} update{cn}(
            @PathVariable Long id,
            @RequestBody {cn} {cv}
    ) {{
        return {cv}Service.update{cn}(id, {cv})
                .orElseThrow();
    }}

    @DeleteMapping("/{{id}}")
    public ResponseEntity<Void> delete{cn}(@PathVariable Long id) {{
        {cv}Service.delete{cn}(id);
        return ResponseEntity.noContent().build();
    }}
}}
"""


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_crud.py <ModelFile.java>")
        sys.exit(1)

    model_file = sys.argv[1]
    if not os.path.isfile(model_file):
        print(f"Fichier introuvable : {model_file}")
        sys.exit(1)

    info = parse_java_model(model_file)
    cn = info["class_name"]

    # Dossier de sortie unique
    out_root = "generated"
    os.makedirs(out_root, exist_ok=True)

    # Génération
    files = {
        os.path.join(out_root, f"{cn}Repository.java"):  gen_repository(info),
        os.path.join(out_root, f"{cn}Service.java"):     gen_service(info),
        os.path.join(out_root, f"{cn}Controller.java"):  gen_controller(info),
    }

    for path, content in files.items():
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ✔  {path}")

    print(f"\n✅  CRUD généré pour '{cn}' dans ./{out_root}/")


if __name__ == "__main__":
    main()