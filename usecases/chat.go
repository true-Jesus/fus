package usecases

import "fus/repo"

type ChatUseCase struct {
	repo *repo.Repo
}

func NewChatUseCase(repo *repo.Repo) *ChatUseCase {
	return &ChatUseCase{repo: repo}
}

func (c *ChatUseCase) GetRooms(user string) (*[]repo.RoomInfo, error) {
	room, err := c.repo.GetRoomsForUser(user)
	if err != nil {
		return nil, err
	}
	return room, nil
}
