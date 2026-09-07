"""Terminal interface for the Local Document AI Assistant."""

import sys

from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.prompt import Prompt

from src.ingest import ingest, EMBEDDING_MODEL
from src.retriever import retrieve
from src.generator import generate, MODEL

console = Console()


def check_ollama():
    """Verify Ollama is running and the model is available."""
    try:
        import ollama
        models = ollama.list().models
        installed = [m.model for m in models]
        for needed in [MODEL, EMBEDDING_MODEL]:
            if not any(needed in name for name in installed):
                console.print(f"[yellow]Model '{needed}' not found. Pulling it now (one-time download) ...[/]")
                ollama.pull(needed)
                console.print(f"[green]Model '{needed}' ready.[/]")
    except Exception as e:
        console.print(f"[red]Cannot connect to Ollama: {e}[/]")
        console.print("[red]Make sure Ollama is installed and running: https://ollama.com[/]")
        sys.exit(1)


def run_ingest():
    """Ingest documents and report results."""
    console.print("\n[bold cyan]Ingesting documents from /docs ...[/]")
    count = ingest()
    if count == 0:
        console.print("[yellow]No documents found. Add .txt or .md files to the docs/ folder.[/]")
    else:
        console.print(f"[green]Done. {count} chunks indexed.[/]")


def run_query(query: str):
    """Retrieve context and generate an answer."""
    console.print(f"\n[dim]Searching for relevant chunks ...[/]")
    chunks = retrieve(query, top_k=3)

    if not chunks:
        console.print("[yellow]No indexed documents found. Run 'ingest' first.[/]")
        return

    console.print(f"[dim]Found {len(chunks)} chunks. Generating answer ...[/]")

    for i, chunk in enumerate(chunks, 1):
        source = chunk["filename"]
        distance = chunk["distance"]
        preview = chunk["text"][:120].replace("\n", " ")
        console.print(f"  [dim]{i}. {source} (distance: {distance:.4f}) {preview}...[/]")

    answer = generate(query, chunks)
    console.print()
    console.print(Panel(Markdown(answer), title="Answer", border_style="green"))


def main():
    console.print(Panel(
        "[bold]Local Document AI Assistant[/]\n"
        f"Using local model: [cyan]{MODEL}[/] via Ollama\n"
        "Commands: [cyan]ingest[/] | [cyan]quit[/] | or type a question",
        border_style="blue",
    ))

    check_ollama()

    while True:
        try:
            user_input = Prompt.ask("\n[bold blue]>[/]").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Goodbye.[/]")
            sys.exit(0)

        if not user_input:
            continue
        if user_input.lower() in ("quit", "exit", "q"):
            console.print("[dim]Goodbye.[/]")
            break
        if user_input.lower() == "ingest":
            run_ingest()
            continue

        run_query(user_input)


if __name__ == "__main__":
    main()
