import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { sessionState } from '../login/SessionState'; // 경로는 실제 구조에 맞게 조정하세요
import { StyledContent, StyledTable, PostBtnPosition, StyledPostBtn, Input, H1 } from './StyledPosting';
import { useNavigate } from 'react-router-dom';

interface User {
    username : string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    count: number;
    team: string;
}

interface NewPost {
    title: string;
    content: string;
    team: string;
}

const BulletinBoard = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState<NewPost>({
        title: '', content: '', team: ''});
    const [editPost, setEditPost] = useState<Post | null>(null);
    const [kakaoNickname, setKakaoNickname] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Post[]>('http://127.0.0.1:8000');
                setPosts(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        const storedNickname = localStorage.getItem('kakao_nickname');
        if (storedNickname) {
            setKakaoNickname(storedNickname);
        }
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        isEditing: boolean = false
    ) => {
        const targetPost = isEditing ? editPost! : newPost;
        const updatedPost = {
            ...targetPost,
            [e.target.name]: e.target.value,
        };

        isEditing ? setEditPost(updatedPost as Post) : setNewPost(updatedPost as NewPost);
    };


    const handlePostSubmit = async () => {
        try {
            const response = await axios.post<Post>('http://127.0.0.1:8000', {
                ...newPost,
                author: kakaoNickname
                });
            setPosts([...posts, response.data]);
            setNewPost({
                title: '', content: '', team: ''});

        } catch (error) {
            console.log(error);
        }
        navigate('/community');

    };


    return (
        <div>
            <StyledTable>
                <thead>
                    <tr id='head'>
                        <th>글 작성</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td>제목</td>
                        <td className='userInput' colSpan={3}><Input
                            type="text"
                            name="title"
                            value={newPost.title}
                            onChange={handleInputChange}
                            placeholder='제목을 입력하세요.'
                        />
                        </td>
                    </tr>
                    <tr>
                        <td className='title'>글쓴이</td>
                        <td className='nickname'>{kakaoNickname || '익명'}</td>
                        <td className='title'>응원구단</td>
                        <td>
                            <select style={{ width: 80, height: 30, textAlign: 'center' }}>
                                <option>구단 선택</option>
                                <option value={"LG"}>LG</option>
                                <option value={"두산"}>두산</option>
                                <option value={"키움"}>키움</option>
                                <option value={"롯데"}>롯데</option>
                                <option value={"삼성"}>삼성</option>
                                <option value={"SSG"}>SSG</option>
                                <option value={"KT"}>KT</option>
                                <option value={"한화"}>한화</option>
                                <option value={"NC"}>NC</option>
                                <option value={"기아"}>기아</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td id='content'>내용</td>
                        <td className='userInput' colSpan={3}>
                            <StyledContent>
                                <textarea
                                    name="content"
                                    value={newPost.content}
                                    onChange={handleInputChange}
                                    placeholder='내용을 입력하세요.'
                                />
                            </StyledContent>
                        </td>
                    </tr>
                </tbody>
            </StyledTable>
            <PostBtnPosition>
                <StyledPostBtn onClick={handlePostSubmit}>등록하기</StyledPostBtn>
            </PostBtnPosition>
        </div>
    );
};
export default BulletinBoard;