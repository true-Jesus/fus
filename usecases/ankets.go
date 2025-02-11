package usecases

import "fus/repo"

type AnketsUC struct {
	repo *repo.Repo
}

func NewAnketsUC(repo *repo.Repo) *AnketsUC {
	return &AnketsUC{repo: repo}
}

func (a *AnketsUC) GetAnkets(user string) (*repo.ProfileData, error) {
	data, err := a.repo.FindMatchingProfile(user)
	if err != nil {
		return nil, err
	}
	return data, nil
}
func (a *AnketsUC) SetAssess(user, targetUser string, asses int) error {
	err := a.repo.SetAssess(user, targetUser, asses)
	if err != nil {
		return err
	}
	return nil
}
