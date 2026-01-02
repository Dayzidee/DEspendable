# Use official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# cache-dir is disabled to keep image small
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Define environment variable
ENV PORT=8080
ENV PYTHONUNBUFFERED=True

# Run app.py when the container launches
# Using Gunicorn with eventlet/gevent would be better for prod, 
# but for simplicity/SocketIO we use the main entry point if it sets up the server
CMD ["python", "app.py"]
