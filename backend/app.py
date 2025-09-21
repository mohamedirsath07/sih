from app import create_app

if __name__ == "__main__":
    app = create_app()
    # Default to port 5000 to match common Flask tooling
    app.run(host="0.0.0.0", port=5000, debug=True)