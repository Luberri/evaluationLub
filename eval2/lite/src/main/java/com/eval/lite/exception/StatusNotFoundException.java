package com.eval.lite.exception;

public class StatusNotFoundException extends RuntimeException {
    private Long statusId;

    public StatusNotFoundException(Long statusId) {
        super("Status not found with id: " + statusId);
        this.statusId = statusId;
    }

    public StatusNotFoundException(String message) {
        super(message);
    }

    public StatusNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public Long getStatusId() {
        return statusId;
    }
}
