// ADH-MOSA.cue
// This file defines the complete ADH-MOSA multi-platform directory structure.
// It enforces identical paths across iOS, Android, and Web.
// It ensures Tabs → Features → SubFeatures → Functions follow MOSA rules.
// It includes descriptions and instructions for each path.

package adh_mosa

#Repo: {
    root: "ADH-MOSA"

    files: {
        "README.md": {
            description: "This file explains what the entire project does and how to use it."
            instruction: "Update this file whenever major features or architecture change."
        }

        "LICENSE": {
            description: "This file contains the legal rules for using the code."
            instruction: "Do not modify this file unless explicitly instructed."
        }

        ".gitignore": {
            description: "This file tells Git which files to ignore."
            instruction: "Add new ignore rules when new tools or build systems are introduced."
        }

        ".editorconfig": {
            description: "This file defines shared formatting rules."
            instruction: "Keep formatting consistent across all languages."
        }

        "Makefile": {
            description: "This file defines common build and automation commands."
            instruction: "Add new commands when new build steps are introduced."
        }

        "docker-compose.cue": {
            description: "This file defines how services run together in development."
            instruction: "Update this file when backend services change."
        }

        "Dockerfile": {
            description: "This file builds the backend container."
            instruction: "Update dependencies when backend frameworks change."
        }

        ".cueconfig": {
            description: "This file tells Cue where schemas and metadata live."
            instruction: "Keep paths accurate when schemas or metadata move."
        }
    }
}

#Config: {
    "config/dev.cue": {
        description: "This file contains development environment settings."
        instruction: "Update this file when new services or ports are added."
    }

    "config/staging.cue": {
        description: "This file contains staging environment settings."
        instruction: "Ensure staging mirrors production except for secrets."
    }

    "config/prod.cue": {
        description: "This file contains production environment settings."
        instruction: "Do not modify this file unless explicitly instructed."
    }
}

#Platforms: {
    platforms: ["ios", "android", "web"]

    for p in platforms {
        "src/\(p)/": {
            description: "This folder contains the platform-specific implementation."
            instruction: "All platform code must follow the MOSA structure."

            "Project/": {
                description: "This folder contains platform-specific project configuration."
                instruction: "Do not modify project files unless explicitly instructed."
            }

            "Tabs/": {
                description: "This folder contains top-level user-facing sections of the app."
                instruction: "Add or remove tabs here as the product evolves."

                "<TabName>/": {
                    description: "This folder represents a single tab in the application."
                    instruction: "Each tab must contain features and a tab.json manifest."

                    "tab.json": {
                        description: "This file declares the features that belong to this tab."
                        instruction: "Update this file when features are added or removed."
                    }

                    "Features/": {
                        description: "This folder contains all features inside this tab."
                        instruction: "Add new features here as independent modules."

                        "<FeatureName>/": {
                            description: "This folder represents a single feature."
                            instruction: "Each feature must contain sub-features and a feature.json manifest."

                            "feature.json": {
                                description: "This file declares the sub-features inside this feature."
                                instruction: "Update this file when sub-features change."
                            }

                            "SubFeatures/": {
                                description: "This folder contains all sub-features for this feature."
                                instruction: "Add new sub-features here as independent modules."

                                "<SubFeatureName>/": {
                                    description: "This folder represents a single sub-feature."
                                    instruction: "Each sub-feature must contain functions and a subfeature.json manifest."

                                    "subfeature.json": {
                                        description: "This file declares the functions inside this sub-feature."
                                        instruction: "Update this file when functions change."
                                    }

                                    "Functions/": {
                                        description: "This folder contains single-responsibility functions."
                                        instruction: "Each file must contain exactly one function."

                                        "<FunctionName>": {
                                            description: "This file contains one function only."
                                            instruction: "Do not add multiple functions to this file."
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            "Shared/": {
                description: "This folder contains shared logic used across all tabs and features."
                instruction: "Place reusable code here, not inside features."

                "UI/": {
                    description: "Shared UI components."
                    instruction: "Add reusable UI elements here."
                }

                "Core/": {
                    description: "Shared logic such as networking, persistence, and analytics."
                    instruction: "Add reusable platform logic here."
                }

                "Extensions/": {
                    description: "Extensions to platform-specific types."
                    instruction: "Add type extensions here."
                }

                "Platform.md": {
                    description: "Documentation for this platform’s architecture."
                    instruction: "Update this file when platform structure changes."
                }
            }
        }
    }
}

#Tests: {
    "tests/iosTests/": {
        description: "Tests for iOS tabs, features, sub-features, and functions."
        instruction: "Mirror the iOS folder structure exactly."
    }

    "tests/androidTests/": {
        description: "Tests for Android tabs, features, sub-features, and functions."
        instruction: "Mirror the Android folder structure exactly."
    }

    "tests/webTests/": {
        description: "Tests for Web tabs, features, sub-features, and functions."
        instruction: "Mirror the Web folder structure exactly."
    }
}

#Docs: {
    "docs/": {
        description: "Human-readable documentation."
        instruction: "Update documentation when architecture or features change."
    }
}

#Schemas: {
    "schemas/structure.cue": {
        description: "This file enforces the MOSA folder structure."
        instruction: "Validate the repo structure against this schema."
    }
}

#Metadata: {
    "data/docs/": {
        description: "YAML metadata for documentation."
        instruction: "Keep metadata synced with Markdown."
    }
}

#Tools: {
    "tools/validate.sh": {
        description: "Script that validates metadata using Cue."
        instruction: "Ensure metadata passes validation."
    }

    "tools/generate-md.sh": {
        description: "Script that generates Markdown sections from metadata."
        instruction: "Use this script when metadata changes."
    }
}

#Infra: {
    "infra/": {
        description: "Cloud and server configuration."
        instruction: "Update infrastructure when new services are added."
    }
}

#LLM: {
    "llm/": {
        description: "Files that control how AI models behave in the system."
        instruction: "Update orchestration logic when new models are added."
    }
}

#Secrets: {
    "secrets/vault/": {
        description: "Encrypted secrets and vault configuration."
        instruction: "Never modify or reveal secrets."
    }
}


