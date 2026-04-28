from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta

from dependencies.db_client import get_session
from dependencies.auth import get_current_user
from schemas.Users import User, UserCreate, UserRead, UserLogin, PasswordChange, Token
from functions.auth_utils import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI Lending Lab API",
        "version": "1.0.0"
    }

@router.post("/register", response_model=UserRead)
async def register_user(
    user: UserCreate,
    session: Annotated[Session, Depends(get_session)]
):
    statement = select(User).where(User.username == user.username)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = hash_password(user.password)
    
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        role=user.role
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(
    user_credentials: UserLogin,
    session: Annotated[Session, Depends(get_session)]
):
    statement = select(User).where(User.username == user_credentials.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if not verify_password(password_data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )
    
    current_user.hashed_password = hash_password(password_data.new_password)
    
    session.add(current_user)
    session.commit()
    
    return {"message": "Password changed successfully"}

@router.get("/me", response_model=UserRead)
async def get_current_user_info(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user
