import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { marked } from "marked";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
// Tabs replaced with plain buttons to avoid routing conflicts with hash navigation
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  FileText,
  FolderOpen,
  Save,
  Eye,
  Pencil,
  CheckCircle2,
  Minus,
  ChevronRight,
  File,
  Folder,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SkillDetail } from "@shared/schema";

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Layer config matching skills.tsx
const LAYER_CONFIG: Record<
  string,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  foundation: { label: "Foundation", bgClass: "bg-blue-500/15", textClass: "text-blue-400", borderClass: "border-blue-500/30" },
  initiative: { label: "Initiatives", bgClass: "bg-purple-500/15", textClass: "text-purple-400", borderClass: "border-purple-500/30" },
  capability: { label: "Capabilities", bgClass: "bg-green-500/15", textClass: "text-green-400", borderClass: "border-green-500/30" },
  intelligence: { label: "Intelligence", bgClass: "bg-amber-500/15", textClass: "text-amber-400", borderClass: "border-amber-500/30" },
  memory: { label: "Memory", bgClass: "bg-teal-500/15", textClass: "text-teal-400", borderClass: "border-teal-500/30" },
};

function getLayerConfig(layer: string) {
  return LAYER_CONFIG[layer] || { label: layer, bgClass: "bg-gray-500/15", textClass: "text-gray-400", borderClass: "border-gray-500/30" };
}

function LayerBadge({ layer }: { layer: string }) {
  const config = getLayerConfig(layer);
  return (
    <Badge
      variant="outline"
      className={`${config.bgClass} ${config.textClass} ${config.borderClass} text-[10px] uppercase tracking-wider font-medium`}
    >
      {config.label}
    </Badge>
  );
}

// Build file tree structure
interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
}

function buildFileTree(files: string[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const dirMap = new Map<string, FileTreeNode>();

  // Sort: SKILL.md first, then folders, then files
  const sorted = [...files].sort((a, b) => {
    if (a === "SKILL.md") return -1;
    if (b === "SKILL.md") return 1;
    const aHasSlash = a.includes("/");
    const bHasSlash = b.includes("/");
    if (aHasSlash && !bHasSlash) return 1;
    if (!aHasSlash && bHasSlash) return -1;
    return a.localeCompare(b);
  });

  for (const file of sorted) {
    const parts = file.split("/");
    if (parts.length === 1) {
      root.push({ name: parts[0], path: file, type: "file" });
    } else {
      const dirName = parts[0];
      if (!dirMap.has(dirName)) {
        const dirNode: FileTreeNode = {
          name: dirName,
          path: dirName,
          type: "folder",
          children: [],
        };
        dirMap.set(dirName, dirNode);
        root.push(dirNode);
      }
      dirMap.get(dirName)!.children!.push({
        name: parts.slice(1).join("/"),
        path: file,
        type: "file",
      });
    }
  }

  // Re-sort root: SKILL.md first, then files, then folders
  root.sort((a, b) => {
    if (a.name === "SKILL.md") return -1;
    if (b.name === "SKILL.md") return 1;
    if (a.type === "folder" && b.type !== "folder") return 1;
    if (a.type !== "folder" && b.type === "folder") return -1;
    return a.name.localeCompare(b.name);
  });

  return root;
}

function FileTreeItem({
  node,
  selectedFile,
  onSelect,
  depth = 0,
}: {
  node: FileTreeNode;
  selectedFile: string;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(true);
  const isSelected = selectedFile === node.path;

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-muted/50 rounded-sm transition-colors`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          data-testid={`tree-folder-${node.name}`}
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
          <Folder className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground/80">{node.name}</span>
        </button>
        {open && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeItem
                key={child.path}
                node={child}
                selectedFile={selectedFile}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.path)}
      className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs rounded-sm transition-colors ${
        isSelected
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-muted/50 text-foreground/70"
      }`}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
      data-testid={`tree-file-${node.name}`}
    >
      <File className="w-3.5 h-3.5" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

// Save commit dialog
function CommitDialog({
  open,
  onOpenChange,
  onCommit,
  isPending,
  filePath,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommit: (message: string) => void;
  isPending: boolean;
  filePath: string;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) setMessage(`Update ${filePath}`);
  }, [open, filePath]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-commit">
        <DialogHeader>
          <DialogTitle className="text-base">Commit Changes</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Commit Message
            </label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your changes..."
              className="text-sm"
              data-testid="input-commit-message"
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            This will push directly to the main branch of the repository.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
            Cancel
          </Button>
          <Button
            onClick={() => onCommit(message)}
            disabled={!message.trim() || isPending}
            size="sm"
            data-testid="button-confirm-commit"
          >
            {isPending ? "Saving..." : "Commit & Push"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Markdown renderer component
function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (match) return content.slice(match[0].length).trim();
  return content;
}

function MarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => {
    try {
      return marked.parse(stripFrontmatter(content)) as string;
    } catch {
      return "<p>Failed to render markdown</p>";
    }
  }, [content]);

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-h1:text-lg prose-h1:border-b prose-h1:border-border prose-h1:pb-2 prose-h1:mb-4
        prose-h2:text-sm prose-h2:mt-6 prose-h2:mb-2
        prose-h3:text-xs prose-h3:mt-4 prose-h3:mb-1
        prose-p:text-foreground/80 prose-p:text-sm prose-p:leading-relaxed
        prose-li:text-foreground/80 prose-li:text-sm
        prose-code:text-primary prose-code:text-xs prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
        prose-table:text-xs
        prose-th:text-foreground/90 prose-th:font-medium prose-th:border-border
        prose-td:text-foreground/70 prose-td:border-border
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground
        prose-hr:border-border"
      dangerouslySetInnerHTML={{ __html: html }}
      data-testid="markdown-content"
    />
  );
}

// Editor component
function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative h-full">
      {/* Line numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/30 border-r border-border overflow-hidden pointer-events-none">
        <div className="p-2 pt-3">
          {value.split("\n").map((_, i) => (
            <div
              key={i}
              className="text-[10px] text-muted-foreground/50 text-right pr-1 leading-[1.625rem] font-mono"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full resize-none rounded-none border-0 pl-12 font-mono text-xs leading-relaxed bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{ tabSize: 2, lineHeight: "1.625rem" }}
        spellCheck={false}
        data-testid="editor-textarea"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const newValue = value.substring(0, start) + "  " + value.substring(end);
            onChange(newValue);
            // Restore cursor position after React re-render
            setTimeout(() => {
              target.selectionStart = target.selectionEnd = start + 2;
            }, 0);
          }
        }}
      />
    </div>
  );
}

export default function SkillDetailPage() {
  const [, params] = useRoute("/skills/:name");
  const skillName = params?.name || "";
  const { toast } = useToast();

  const { data: skill, isLoading } = useQuery<SkillDetail>({
    queryKey: ["/api/skills", skillName],
    enabled: !!skillName,
  });

  const [selectedFile, setSelectedFile] = useState("SKILL.md");
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [commitDialogOpen, setCommitDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("skill");

  // Get content for the currently selected file
  const currentContent = useMemo(() => {
    if (!skill) return "";
    if (selectedFile === "SKILL.md") return skill.skillMd;
    const ref = skill.referenceFiles.find((f) => f.path === selectedFile);
    return ref?.content || "";
  }, [skill, selectedFile]);

  // Update editor content when file changes
  useEffect(() => {
    setEditContent(currentContent);
    setEditMode(false);
  }, [currentContent]);

  // Tab changes now handled directly in button onClick handlers

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("PUT", `/api/skills/${skillName}/file?path=${encodeURIComponent(selectedFile)}`, {
        content: editContent,
        message,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills", skillName] });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Saved", description: `${selectedFile} has been committed.` });
      setCommitDialogOpen(false);
      setEditMode(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Save failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const fileTree = useMemo(() => {
    if (!skill) return [];
    return buildFileTree(skill.files);
  }, [skill]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4" data-testid="page-skill-detail-loading">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-[600px] w-60" />
          <Skeleton className="h-[600px] flex-1" />
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="p-6" data-testid="page-skill-not-found">
        <p className="text-sm text-muted-foreground">Skill not found.</p>
        <Link href="/skills">
          <Button variant="ghost" size="sm" className="mt-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Skills
          </Button>
        </Link>
      </div>
    );
  }

  const layerConfig = getLayerConfig(skill.layer);

  return (
    <div className="h-full flex flex-col" data-testid="page-skill-detail">
      {/* Header */}
      <div className="px-6 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/skills">
            <Button variant="ghost" size="sm" className="h-7 px-2" data-testid="button-back-skills">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold text-foreground truncate">
              {skill.displayName}
            </h1>
            <p className="text-[11px] font-mono text-muted-foreground">{skill.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-9">
          <LayerBadge layer={skill.layer} />
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <FileText className="w-3 h-3" />
            {skill.fileCount} files
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] ${
              skill.hasIoContract ? "text-green-400" : "text-muted-foreground/50"
            }`}
          >
            {skill.hasIoContract ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            I/O Contract
          </span>
          {skill.description && (
            <span className="text-xs text-muted-foreground truncate max-w-md">
              — {skill.description}
            </span>
          )}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left panel: file tree */}
        <div className="w-56 border-r border-border shrink-0 flex flex-col bg-muted/10">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Files
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-1">
              {fileTree.map((node) => (
                <FileTreeItem
                  key={node.path}
                  node={node}
                  selectedFile={selectedFile}
                  onSelect={(path) => {
                    setSelectedFile(path);
                    // Update active tab based on selection
                    if (path === "SKILL.md") setActiveTab("skill");
                    else if (path === "references/io-contract.md") setActiveTab("io-contract");
                    else setActiveTab("references");
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right panel: content viewer/editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="border-b border-border shrink-0">
            <div className="flex items-center justify-between px-4">
                <div className="flex h-9 items-center gap-0">
                  <button
                    onClick={(e) => { e.preventDefault(); setActiveTab("skill"); setSelectedFile("SKILL.md"); }}
                    className={`h-9 px-3 text-xs border-b-2 transition-colors ${
                      activeTab === "skill"
                        ? "border-primary text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid="tab-skill-md"
                  >
                    SKILL.md
                  </button>
                  {skill.hasIoContract && (
                    <button
                      onClick={(e) => { e.preventDefault(); setActiveTab("io-contract"); setSelectedFile("references/io-contract.md"); }}
                      className={`h-9 px-3 text-xs border-b-2 transition-colors ${
                        activeTab === "io-contract"
                          ? "border-primary text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid="tab-io-contract"
                    >
                      I/O Contract
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); setActiveTab("references"); setSelectedFile("SKILL.md"); }}
                    className={`h-9 px-3 text-xs border-b-2 transition-colors ${
                      activeTab === "references"
                        ? "border-primary text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid="tab-references"
                  >
                    References
                  </button>
                </div>

                {/* View/Edit toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={editMode ? "ghost" : "secondary"}
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => setEditMode(false)}
                    data-testid="button-view-mode"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </Button>
                  <Button
                    variant={editMode ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => {
                      setEditMode(true);
                      setEditContent(currentContent);
                    }}
                    data-testid="button-edit-mode"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                  {editMode && (
                    <Button
                      size="sm"
                      className="h-7 text-xs gap-1.5"
                      onClick={() => setCommitDialogOpen(true)}
                      disabled={editContent === currentContent}
                      data-testid="button-save"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </Button>
                  )}
                </div>
              </div>
          </div>

          {/* File path bar */}
          <div className="px-4 py-1.5 border-b border-border bg-muted/20 shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground">
              _skills/{skill.name}/{selectedFile}
            </span>
          </div>

          {/* Content area */}
          <div className="flex-1 min-h-0">
            {editMode ? (
              <CodeEditor value={editContent} onChange={setEditContent} />
            ) : (
              <ScrollArea className="h-full">
                {activeTab === "references" && selectedFile !== "SKILL.md" && !selectedFile.endsWith(".md") ? (
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground">
                      Select a reference file from the tree to view its contents.
                    </p>
                  </div>
                ) : activeTab === "references" && selectedFile === "SKILL.md" ? (
                  <div className="p-6 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Reference Files</h3>
                    {skill.referenceFiles.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No reference files found.</p>
                    ) : (
                      <div className="space-y-2">
                        {skill.referenceFiles.map((ref) => (
                          <button
                            key={ref.path}
                            onClick={() => setSelectedFile(ref.path)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-md border border-border hover:bg-muted/50 transition-colors"
                            data-testid={`ref-file-${ref.name}`}
                          >
                            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{ref.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{ref.path}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6">
                    <MarkdownRenderer content={currentContent || "*No content*"} />
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </div>
      </div>

      <CommitDialog
        open={commitDialogOpen}
        onOpenChange={setCommitDialogOpen}
        onCommit={(message) => saveMutation.mutate(message)}
        isPending={saveMutation.isPending}
        filePath={selectedFile}
      />
    </div>
  );
}
